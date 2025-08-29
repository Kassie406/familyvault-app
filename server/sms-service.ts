import { log } from './vite';

export interface SMSMessage {
  to: string;
  body: string;
}

export class SMSService {
  private twilioSid: string | undefined;
  private twilioToken: string | undefined;
  private twilioFrom: string | undefined;

  constructor() {
    this.twilioSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioFrom = process.env.TWILIO_FROM_NUMBER;
  }

  private isConfigured(): boolean {
    return !!(this.twilioSid && this.twilioToken && this.twilioFrom);
  }

  async sendSMS(to: string, body: string): Promise<boolean> {
    if (!this.isConfigured()) {
      log(`SMS not configured - would send to ${to}: ${body}`);
      return false;
    }

    try {
      // Using dynamic import to avoid requiring Twilio when not configured
      const twilio = await import('twilio');
      const client = twilio.default(this.twilioSid, this.twilioToken);

      const message = await client.messages.create({
        body,
        from: this.twilioFrom,
        to
      });

      log(`SMS sent successfully: ${message.sid}`);
      return true;
    } catch (error) {
      log(`Failed to send SMS to ${to}: ${error}`);
      return false;
    }
  }

  async sendMultipleSMS(messages: SMSMessage[]): Promise<void> {
    const promises = messages.map(msg => this.sendSMS(msg.to, msg.body));
    await Promise.allSettled(promises);
  }

  getConfigurationStatus(): { configured: boolean; missing: string[] } {
    const missing = [];
    if (!this.twilioSid) missing.push('TWILIO_ACCOUNT_SID');
    if (!this.twilioToken) missing.push('TWILIO_AUTH_TOKEN');
    if (!this.twilioFrom) missing.push('TWILIO_FROM_NUMBER');

    return {
      configured: missing.length === 0,
      missing
    };
  }
}

export const smsService = new SMSService();