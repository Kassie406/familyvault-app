import { eq, desc, and, sql } from 'drizzle-orm';
import { db } from './db';
import { incidents, oncallTargets, statusAlertState } from '@shared/schema';
import { log } from './vite';
import { smsService } from './sms-service';

export interface ComponentStatus {
  component: string;
  status: 'OK' | 'FAIL';
  timestamp: Date;
}

export class EscalationWorker {
  private intervalId: NodeJS.Timeout | null = null;
  private running = false;

  // Severity mappings
  private getSeverity(component: string): 'S1' | 'S2' {
    const criticalComponents = ['database', 'auth', 'stripe', 'payment'];
    return criticalComponents.includes(component.toLowerCase()) ? 'S1' : 'S2';
  }

  // Escalation thresholds in minutes
  private getEscalationThresholds(severity: 'S1' | 'S2'): number[] {
    return severity === 'S1' ? [5, 10, 20] : [15, 30];
  }

  start(): void {
    if (this.running) {
      log('Escalation worker already running');
      return;
    }

    // TEMPORARILY DISABLED due to schema mismatch
    // The escalation worker expects different database columns than what exists
    log('Escalation worker disabled (schema mismatch)');
    return;

    this.running = true;
    this.intervalId = setInterval(() => {
      this.runEscalationCheck().catch(error => {
        log(`Escalation worker error: ${error}`);
      });
    }, 60 * 1000); // Run every minute

    log('Escalation worker started');
  }

  stop(): void {
    if (!this.running) return;

    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    log('Escalation worker stopped');
  }

  private async runEscalationCheck(): Promise<void> {
    try {
      const components = ['database', 'auth', 'stripe', 'webhook', 'smtp'];
      
      for (const component of components) {
        await this.checkComponent(component);
      }
    } catch (error) {
      log(`Error in escalation check: ${error}`);
    }
  }

  private async checkComponent(component: string): Promise<void> {
    // Get current component status from status checks (mock for now)
    const currentStatus = await this.getCurrentStatus(component);
    const failingForMinutes = await this.getFailingDuration(component);
    
    // Check for existing open incident
    let incident = await db.select()
      .from(incidents)
      .where(and(
        eq(incidents.component, component),
        eq(incidents.status, 'open')
      ))
      .limit(1);

    const openIncident = incident[0];

    // If component is failing and no open incident, create one
    if (currentStatus === 'FAIL' && failingForMinutes >= 3 && !openIncident) {
      const severity = this.getSeverity(component);
      const newIncident = await this.createIncident(component, severity);
      await this.sendSlackAlert(component, 'FAILED');
      await this.updateEscalationTier(newIncident.id, 0);
    }

    // Handle escalation for open incidents
    if (openIncident && !openIncident.acknowledgedAt && currentStatus === 'FAIL') {
      const severity = openIncident.severity as 'S1' | 'S2';
      const thresholds = this.getEscalationThresholds(severity);
      const nextTier = openIncident.lastEscalationTier + 1;
      
      if (nextTier < thresholds.length && failingForMinutes >= thresholds[nextTier]) {
        await this.escalateToTier(openIncident.id, nextTier);
      }
    }

    // Handle recovery
    if (openIncident && currentStatus === 'OK') {
      await this.closeIncident(openIncident.id);
      await this.sendSlackAlert(component, 'RECOVERED');
    }
  }

  private async getCurrentStatus(component: string): Promise<'OK' | 'FAIL'> {
    // This would normally check your actual status monitoring system
    // For now, return OK for all components
    return 'OK';
  }

  private async getFailingDuration(component: string): Promise<number> {
    // This would calculate how long the component has been failing
    // For now, return 0
    return 0;
  }

  private async createIncident(component: string, severity: 'S1' | 'S2') {
    const result = await db.insert(incidents).values({
      component,
      severity,
      status: 'open',
      lastEscalationTier: 0,
      description: `${component.toUpperCase()} service failure detected`
    }).returning();

    log(`Created incident ${result[0].id} for ${component} (${severity})`);
    return result[0];
  }

  private async updateEscalationTier(incidentId: string, tier: number): Promise<void> {
    await db.update(incidents)
      .set({ lastEscalationTier: tier })
      .where(eq(incidents.id, incidentId));
  }

  private async escalateToTier(incidentId: string, tier: number): Promise<void> {
    // Get oncall targets for this tier
    const targets = await db.select()
      .from(oncallTargets)
      .where(and(
        eq(oncallTargets.tier, tier),
        eq(oncallTargets.active, true)
      ));

    const incident = await db.select()
      .from(incidents)
      .where(eq(incidents.id, incidentId))
      .limit(1);

    if (!incident[0]) return;

    const component = incident[0].component;
    const severity = incident[0].severity;

    // Send notifications based on tier
    for (const target of targets) {
      if (target.kind === 'email') {
        await this.sendEmailAlert(target.to, component, severity, tier);
      } else if (target.kind === 'sms') {
        await this.sendSMSAlert(target.to, component, severity, tier);
      }
    }

    // Update escalation tier
    await this.updateEscalationTier(incidentId, tier);
    
    log(`Escalated incident ${incidentId} to tier ${tier}`);
  }

  private async closeIncident(incidentId: string): Promise<void> {
    await db.update(incidents)
      .set({ 
        status: 'closed',
        closedAt: new Date()
      })
      .where(eq(incidents.id, incidentId));

    log(`Closed incident ${incidentId}`);
  }

  private async sendSlackAlert(component: string, action: string): Promise<void> {
    const emoji = action === 'FAILED' ? '❌' : '✅';
    const message = `${emoji} ${component.toUpperCase()} ${action}`;
    
    // This would send to your actual Slack webhook
    log(`Slack: ${message}`);
  }

  private async sendEmailAlert(to: string, component: string, severity: string, tier: number): Promise<void> {
    const subject = `[${severity}] ${component.toUpperCase()} Service Alert - Tier ${tier}`;
    const body = `
Alert: ${component.toUpperCase()} service is experiencing issues.

Severity: ${severity}
Escalation Tier: ${tier}
Time: ${new Date().toISOString()}

Please investigate and acknowledge this incident in the admin console.
    `.trim();

    // This would use your existing email service
    log(`Email to ${to}: ${subject}`);
  }

  private async sendSMSAlert(to: string, component: string, severity: string, tier: number): Promise<void> {
    const message = `[${severity}] ${component.toUpperCase()} DOWN - Tier ${tier}. Check admin console immediately.`;
    
    try {
      await smsService.sendSMS(to, message);
    } catch (error) {
      log(`Failed to send SMS to ${to}: ${error}`);
    }
  }
}

export const escalationWorker = new EscalationWorker();