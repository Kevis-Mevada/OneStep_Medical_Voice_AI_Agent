import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD, // Use app password for Gmail
    },
  });

  return transporter;
};

/**
 * Send email using Gmail SMTP
 */
export const sendSmtpEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = createTransporter();

    // Verify connection configuration
    await transporter.verify();

    const mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('SMTP email error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send email via SMTP' 
    };
  }
};

/**
 * Send verification email using SMTP
 */
export const sendVerificationEmailSmtp = async (to: string, verificationLink: string) => {
  const subject = 'Verify Your Email Address';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Email Verification</h2>
      <p>Thank you for registering with Onestep Medical Voice AI.</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}" style="background-color: #0F766E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${verificationLink}</p>
      <p>This link will expire in 1 hour.</p>
      <hr>
      <p><small>If you did not register for this account, please ignore this email.</small></p>
    </div>
  `;

  return sendSmtpEmail(to, subject, html);
};

/**
 * Send password reset email using SMTP
 */
export const sendPasswordResetEmailSmtp = async (to: string, resetLink: string) => {
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset</h2>
      <p>You requested a password reset for your Onestep Medical Voice AI account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}" style="background-color: #0F766E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Reset Password</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${resetLink}</p>
      <p>This link will expire in 1 hour.</p>
      <hr>
      <p><small>If you did not request a password reset, please ignore this email.</small></p>
    </div>
  `;

  return sendSmtpEmail(to, subject, html);
};