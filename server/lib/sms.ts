import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

// Store OTP codes temporarily (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expires: number }>();

export async function sendLoginCodeSms(to: string, code: string) {
  await client.messages.create({
    from: process.env.TWILIO_FROM!,
    to,
    body: `Your Family Vault code: ${code} (valid 10 minutes)`
  });
}

export async function sendOtpSms(to: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  // Store the code
  otpStore.set(to, { code, expires });
  
  await client.messages.create({
    from: process.env.TWILIO_FROM!,
    to,
    body: `Your Family Vault verification code: ${code} (valid 10 minutes)`
  });
}

export async function checkOtpSms(phone: string, code: string): Promise<boolean> {
  const stored = otpStore.get(phone);
  if (!stored) return false;
  
  if (Date.now() > stored.expires) {
    otpStore.delete(phone);
    return false;
  }
  
  if (stored.code === code) {
    otpStore.delete(phone);
    return true;
  }
  
  return false;
}
