import { isNewDevice } from './request-tracker.js';

interface User {
  id: string;
  email: string;
  orgId?: string;
}

/**
 * Check if device is new and send email alert if needed
 * Call this after successful login (password or passkey)
 */
export async function maybeSendNewDeviceEmail(
  user: User,
  userAgent: string | null | undefined,
  ip: string | null | undefined
): Promise<void> {
  try {
    // Check if this is a new device (not seen in last 30 days)
    const isNew = await isNewDevice(user.id, userAgent, ip);
    
    if (!isNew) {
      return; // Device has been seen recently
    }

    // TODO: Implement actual email service integration
    // For now, we'll log the event for demo purposes
    console.log(`New device login detected for user ${user.email}:`);
    console.log(`  IP: ${ip || 'N/A'}`);
    console.log(`  User Agent: ${userAgent || 'N/A'}`);
    console.log(`  Time: ${new Date().toISOString()}`);

    // In a real implementation, you would send an email here:
    /*
    await sendEmail({
      to: user.email,
      subject: 'New device signed in to FamilyCircle Secure',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">New Device Sign-In Alert</h2>
          <p>A new device just signed in to your <strong>FamilyCircle Secure</strong> account.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>IP Address:</strong> ${ip || 'N/A'}</p>
            <p><strong>Device:</strong> ${userAgent || 'Unknown device'}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>If this wasn't you, please:</p>
          <ul>
            <li><a href="${process.env.APP_URL || 'http://localhost:5000'}/settings">Review your active sessions</a></li>
            <li>Log out other devices if needed</li>
            <li>Change your password immediately</li>
          </ul>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This is an automated security alert from FamilyCircle Secure.
          </p>
        </div>
      `
    });
    */

  } catch (error) {
    // Don't fail login if email alert fails
    console.error('Failed to send new device email alert:', error);
  }
}

/**
 * Format user agent string for display
 */
export function formatUserAgent(userAgent: string | null): string {
  if (!userAgent) return 'Unknown device';
  
  // Basic browser detection
  if (userAgent.includes('Chrome')) return 'Chrome Browser';
  if (userAgent.includes('Firefox')) return 'Firefox Browser';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari Browser';
  if (userAgent.includes('Edge')) return 'Edge Browser';
  if (userAgent.includes('Mobile')) return 'Mobile Device';
  
  return 'Desktop Browser';
}

/**
 * Format IP address for display
 */
export function formatIpAddress(ip: string | null): string {
  if (!ip) return 'Unknown location';
  
  // Handle localhost and local networks
  if (ip === '127.0.0.1' || ip === '::1') return 'Localhost';
  if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return 'Local network';
  }
  
  return ip;
}