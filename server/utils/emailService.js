const nodemailer = require('nodemailer');

// In-memory store for recent sent emails (allows previewing emails in development or before SMTP setup)
const recentSentEmails = new Map();

/**
 * Send email using available transports:
 * 1. Resend REST API (HTTPS port 443 - works everywhere)
 * 2. Brevo / Sendinblue REST API (HTTPS port 443)
 * 3. Nodemailer SMTP (Gmail / Custom SMTP)
 * 4. In-App Mock Delivery (with simulated inbox preview)
 */
async function sendPasswordResetEmail(to, code, userName = 'Valued User') {
  const cleanTo = to.trim().toLowerCase();
  const fromAddress = process.env.EMAIL_FROM || 'Care Connect <no-reply@careconnect.in>';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
        .body { padding: 32px 28px; }
        .code-box { background: #f0fdfa; border: 2px dashed #0d9488; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
        .code-text { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0f766e; font-family: 'Courier New', Courier, monospace; margin: 0; }
        .notice { font-size: 13px; color: #64748b; line-height: 1.6; }
        .footer { background: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>CARE CONNECT</h1>
          <p>Healthcare & Doctor Appointment Management System</p>
        </div>
        <div class="body">
          <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Password Reset Verification Code</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #334155;">
            Hello ${userName},<br><br>
            We received a request to reset your password for your <strong>Care Connect</strong> account (${cleanTo}). Use the 6-digit verification code below to complete the reset:
          </p>
          
          <div class="code-box">
            <div style="font-size: 12px; text-transform: uppercase; color: #0d9488; font-weight: 700; margin-bottom: 6px;">Your 6-Digit Verification Code</div>
            <p class="code-text">${code}</p>
            <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Valid for 15 minutes</div>
          </div>

          <p class="notice">
            • Do not share this verification code with anyone.<br>
            • If you did not request a password reset, you can safely ignore this email — your account remains secure.
          </p>
        </div>
        <div class="footer">
          © 2026 Care Connect Healthcare System • Delhi NCR<br>
          Dummy Connect Helpline: +91 98765 43210 | support@careconnect.in
        </div>
      </div>
    </body>
    </html>
  `;

  // Always record into recent sent emails for instant UI simulation
  const emailRecord = {
    to: cleanTo,
    code,
    subject: 'Care Connect - Your Password Reset Verification Code',
    html: htmlContent,
    sentAt: new Date(),
    deliveredVia: 'local_simulation',
  };
  recentSentEmails.set(cleanTo, emailRecord);

  // 1. Try Resend API (HTTPS port 443)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [cleanTo],
          subject: 'Care Connect - Your Password Reset Verification Code',
          html: htmlContent,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`[Email Service - Resend] Sent to ${cleanTo} | ID: ${data.id}`);
        emailRecord.deliveredVia = 'resend_api';
        return { success: true, provider: 'resend', id: data.id };
      }
      console.warn('[Email Service - Resend Warning]:', data);
    } catch (apiErr) {
      console.error('[Email Service - Resend Error]:', apiErr.message);
    }
  }

  // 2. Try Brevo API (HTTPS port 443)
  if (process.env.BREVO_API_KEY) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Care Connect', email: process.env.BREVO_SENDER || 'no-reply@careconnect.in' },
          to: [{ email: cleanTo, name: userName }],
          subject: 'Care Connect - Your Password Reset Verification Code',
          htmlContent,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`[Email Service - Brevo] Sent to ${cleanTo} | ID: ${data.messageId}`);
        emailRecord.deliveredVia = 'brevo_api';
        return { success: true, provider: 'brevo', id: data.messageId };
      }
      console.warn('[Email Service - Brevo Warning]:', data);
    } catch (apiErr) {
      console.error('[Email Service - Brevo Error]:', apiErr.message);
    }
  }

  // 3. Try Nodemailer SMTP (e.g. Gmail App Password)
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: fromAddress,
        to: cleanTo,
        subject: 'Care Connect - Your Password Reset Verification Code',
        text: `Your Care Connect password reset verification code is: ${code}. Valid for 15 minutes.`,
        html: htmlContent,
      });

      console.log(`[Email Service - SMTP] Sent to ${cleanTo} | ID: ${info.messageId}`);
      emailRecord.deliveredVia = 'smtp';
      return { success: true, provider: 'smtp', id: info.messageId };
    } catch (smtpErr) {
      console.error(`[Email Service - SMTP Error]: ${smtpErr.message}`);
    }
  }

  // 4. Default / Simulated fallback
  console.log(`[Email Service - Local Mailbox] Verification code saved for ${cleanTo} -> Code: ${code}`);
  return { success: true, provider: 'local_simulation' };
}

/**
 * Retrieve the latest sent email for a specific recipient (for testing & demo UI)
 */
function getLatestSentEmail(email) {
  if (!email) return null;
  return recentSentEmails.get(email.trim().toLowerCase()) || null;
}

module.exports = {
  sendPasswordResetEmail,
  getLatestSentEmail,
};
