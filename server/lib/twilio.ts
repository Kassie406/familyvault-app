import twilio from "twilio";

// Twilio client configuration
export const twilioClient = twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_AUTH!
);

export const TWILIO_FROM = process.env.TWILIO_FROM!;

// Helper function to validate E.164 phone format
export function isValidE164(phone: string): boolean {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

// Format phone number to E.164 if needed
export function formatToE164(phone: string, defaultCountryCode = '+1'): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If already starts with +, validate and return
  if (phone.startsWith('+')) {
    return isValidE164(phone) ? phone : '';
  }
  
  // If starts with country code (like 1 for US), add +
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If 10 digits, assume US number
  if (digits.length === 10) {
    return `${defaultCountryCode}${digits}`;
  }
  
  // If 11 digits starting with 1, format as US
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  return '';
}

// SMS notification helper
export interface SMSNotificationOptions {
  to: string;
  message: string;
  statusCallback?: string;
}

export async function sendSMSNotification(options: SMSNotificationOptions): Promise<{success: boolean, messageId?: string, error?: string}> {
  try {
    if (!isValidE164(options.to)) {
      throw new Error('Invalid phone number format. Must be E.164 format (+1234567890)');
    }

    const message = await twilioClient.messages.create({
      from: TWILIO_FROM,
      to: options.to,
      body: options.message,
      statusCallback: options.statusCallback,
    });

    return {
      success: true,
      messageId: message.sid
    };
  } catch (error: any) {
    console.error('Failed to send SMS:', error);
    return {
      success: false,
      error: error.message || 'Unknown error sending SMS'
    };
  }
}