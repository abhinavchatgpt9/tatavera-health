import nodemailer from 'nodemailer';

const SUBJECT_VERIFY = 'Your Tatvavera Health verification code';
const SUBJECT_2FA = 'Your Tatvavera Health login code';

function buildOtpHtml(code: string, title: string) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
  <p>${title}</p>
  <p style="font-size: 28px; letter-spacing: 0.2em; font-weight: 700;">${code}</p>
  <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
</body>
</html>`;
}

/** Resend HTTP API (free tier: https://resend.com) — no domain needed for onboarding@resend.dev in dev */
async function sendViaResend(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.FROM_EMAIL || 'Tatvavera Health <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error: ${res.status} ${text}`);
  }
  return true;
}

async function sendViaSmtp(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL;
  if (!host || !from || !user || !pass) return false;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transporter.sendMail({ from, to, subject, html });
  return true;
}

export async function sendSignupVerificationEmail(to: string, code: string) {
  const html = buildOtpHtml(code, 'Use this code to verify your email and finish creating your account:');
  if (await sendViaResend(to, SUBJECT_VERIFY, html).catch(() => false)) return;
  if (await sendViaSmtp(to, SUBJECT_VERIFY, html).catch(() => false)) return;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[email:dev] Signup OTP for ${to}: ${code}`);
    return;
  }
  throw new Error(
    'Email not configured. Set RESEND_API_KEY (recommended) or SMTP_HOST/SMTP_USER/SMTP_PASS/FROM_EMAIL.'
  );
}

function isRelaxedEmailEnv() {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.AUTH_DEV_OTP === '1' ||
    process.env.AUTH_DEV_OTP === 'true'
  );
}

/** Never throws — login must always proceed after OTP is stored. Always logs the code for server-side testing. */
export async function sendTwoFactorEmail(to: string, code: string): Promise<void> {
  const html = buildOtpHtml(code, 'Use this code to complete your login:');
  const relaxed = isRelaxedEmailEnv();
  // Always log so `next start` / production misconfig still yields a code in the terminal.
  console.info(`[tatavera-otp] 2FA for ${to} code=${code}${relaxed ? ' (email failure will not block login)' : ''}`);

  try {
    if (await sendViaResend(to, SUBJECT_2FA, html).catch(() => false)) return;
    if (await sendViaSmtp(to, SUBJECT_2FA, html).catch(() => false)) return;
  } catch (e) {
    console.error('[tatavera-otp] provider error', e);
  }

  if (!relaxed) {
    console.warn(
      '[tatavera-otp] Email not delivered; set RESEND_API_KEY/SMTP or AUTH_DEV_OTP=1 for local prod builds. Code was logged above.'
    );
  }
}
