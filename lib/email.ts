import nodemailer from 'nodemailer';
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '@/lib/constants';

const SUBJECT_VERIFY = `Your ${SITE_NAME} verification code`;
const SUBJECT_2FA = `Your ${SITE_NAME} login code`;

// Branded HTML wrapper shared by every transactional email. Kept table-based
// with inline styles (no external CSS/images) since that's what actually
// renders consistently across Gmail, Outlook, and mobile mail clients.
function brandedEmailShell(opts: { preheader: string; bodyHtml: string }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${SITE_NAME}</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <!-- Preheader: shown as inbox preview text, hidden in the body -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${opts.preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(15,23,42,0.08);">

          <!-- Header / brand bar -->
          <tr>
            <td style="background-color:#0f172a; padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px; height:36px; background-color:#2563eb; border-radius:10px; text-align:center; vertical-align:middle;">
                    <span style="color:#ffffff; font-weight:700; font-size:16px; line-height:36px;">T</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff; font-weight:700; font-size:16px;">${SITE_NAME}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px;">
              ${opts.bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px; border-top:1px solid #e2e8f0;">
              <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.6;">
                This email was sent by ${SITE_NAME} because it's associated with an account on
                <a href="${SITE_URL}" style="color:#2563eb; text-decoration:none;">${SITE_URL.replace('https://', '')}</a>.
                If you didn't request this, you can safely ignore it — no changes were made to your account.
              </p>
              <p style="margin:8px 0 0; color:#cbd5e1; font-size:12px;">
                Need help? Contact us at <a href="mailto:${CONTACT_EMAIL}" style="color:#94a3b8;">${CONTACT_EMAIL}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildOtpHtml(code: string, title: string, preheader: string) {
  const bodyHtml = `
    <p style="margin:0 0 20px; color:#0f172a; font-size:16px; line-height:1.6;">${title}</p>
    <div style="margin:0 0 20px; padding:18px 20px; background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; text-align:center;">
      <span style="font-family:'SF Mono',Consolas,Menlo,monospace; font-size:32px; font-weight:700; letter-spacing:0.3em; color:#2563eb;">${code}</span>
    </div>
    <p style="margin:0; color:#64748b; font-size:14px; line-height:1.6;">This code expires in <strong>10 minutes</strong>. Never share it with anyone — ${SITE_NAME} staff will never ask you for it.</p>
  `;
  return brandedEmailShell({ preheader, bodyHtml });
}

/** Resend HTTP API (free tier: https://resend.com) — no domain needed for onboarding@resend.dev in dev */
async function sendViaResend(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.FROM_EMAIL || 'Tatavera Health <onboarding@resend.dev>';
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
  const html = buildOtpHtml(
    code,
    `Use this code to verify your email and finish creating your ${SITE_NAME} account:`,
    `Your verification code is ${code}`
  );
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
  const html = buildOtpHtml(code, 'Use this code to complete your login:', `Your login code is ${code}`);
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
