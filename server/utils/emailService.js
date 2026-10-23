const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = process.env.SMTP_PORT || 587;

  if (smtpUser && smtpPass) {
    // Production / Configured SMTP (e.g. Gmail App Password, Sendgrid, Mailgun)
    cachedTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    console.log(`[Email Service] Configured live SMTP with user: ${smtpUser}`);
    return cachedTransporter;
  }

  // Development / Default fast transport: logs email safely on server without exposing to client UI
  cachedTransporter = nodemailer.createTransport({
    jsonTransport: true,
  });
  console.log('[Email Service] Configured local mail transport (SMTP credentials can be added to server/.env)');
  return cachedTransporter;
}

/**
 * Send password reset verification code email
 * @param {string} to - Recipient email
 * @param {string} code - 6-digit verification code
 * @param {string} userName - Optional user name
 */
async function sendPasswordResetEmail(to, code, userName = 'Valued User') {
  try {
    const transporter = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Care Connect Support" <no-reply@careconnect.in>';

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
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Password Reset Request</h2>
            <p style="font-size: 14px; line-height: 1.5; color: #334155;">
              Hello ${userName},<br><br>
              We received a request to reset your password for your <strong>Care Connect</strong> account. Use the 6-digit verification code below to complete the reset:
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

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: 'Care Connect - Your Password Reset Verification Code',
      text: `Your Care Connect password reset verification code is: ${code}. This code is valid for 15 minutes.`,
      html: htmlContent,
    });

    console.log(`[Email Service] Verification email dispatched to: ${to} | Verification Code: ${code} (Hidden from client UI)`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Service Error] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPasswordResetEmail,
};
