import nodemailer from 'nodemailer';
import { logger } from './logger.js';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

class EmailService {
    private transporter: nodemailer.Transporter | null;
    private isDevelopmentMode: boolean;

    constructor() {
        this.isDevelopmentMode = process.env.NODE_ENV === 'development' && process.env.DISABLE_EMAIL === 'true';

        if (this.isDevelopmentMode) {
            this.transporter = null;
            logger.info('Email service disabled for development mode');
        } else {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                tls: {
                    rejectUnauthorized: false, // Allow self-signed certificates in development
                },
            });
        }
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        // In development mode with disabled email, just log the email details
        if (this.isDevelopmentMode || !this.transporter) {
            logger.info(`Development mode: Email would be sent to: ${options.to}`);
            logger.info(`Subject: ${options.subject}`);
            logger.info(`Email content preview: ${options.html?.substring(0, 200)}...`);
            return;
        }

        try {
            const mailOptions = {
                from: `"${process.env.EMAIL_FROM_NAME || 'Campus Syllabus Hub'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent successfully: ${info.messageId}`);
        } catch (error) {
            logger.error('Failed to send email');
            logger.error(error);

            // Provide more specific error messages for common issues
            if (error instanceof Error) {
                if (error.message.includes('self-signed certificate')) {
                    throw new Error('SMTP certificate error. Check your SMTP configuration.');
                } else if (error.message.includes('authentication failed')) {
                    throw new Error('SMTP authentication failed. Check your email credentials.');
                } else if (error.message.includes('ECONNECTION')) {
                    throw new Error('Unable to connect to SMTP server. Check your SMTP host and port.');
                } else {
                    throw new Error(`Email send failed: ${error.message}`);
                }
            }

            throw new Error('Failed to send email');
        }
    }

    async sendVerificationEmail(email: string, name: string, verificationToken: string): Promise<void> {
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Verify Your Email</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
                    .content { padding: 30px; background-color: #f9fafb; }
                    .button { 
                        display: inline-block; 
                        background-color: #2563eb; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        margin: 20px 0;
                    }
                    .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Campus Syllabus Hub</h1>
                    </div>
                    <div class="content">
                        <h2>Welcome ${name}!</h2>
                        <p>Thank you for registering with Campus Syllabus Hub. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
                        
                        <p style="text-align: center;">
                            <a href="${verificationUrl}" class="button">Verify Email Address</a>
                        </p>
                        
                        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
                        
                        <p><strong>This verification link will expire in 24 hours.</strong></p>
                        
                        <p>If you didn't create an account with us, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>Campus Syllabus Hub - Your Academic Resource Platform</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const text = `
Welcome ${name}!

Thank you for registering with Campus Syllabus Hub. To complete your registration, please verify your email address by visiting:

${verificationUrl}

This verification link will expire in 24 hours.

If you didn't create an account with us, please ignore this email.

Campus Syllabus Hub - Your Academic Resource Platform
        `;

        await this.sendEmail({
            to: email,
            subject: 'Verify Your Email - Campus Syllabus Hub',
            html,
            text,
        });
    }

    async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Reset Your Password</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
                    .content { padding: 30px; background-color: #f9fafb; }
                    .button { 
                        display: inline-block; 
                        background-color: #2563eb; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        margin: 20px 0;
                    }
                    .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Campus Syllabus Hub</h1>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>Hello ${name},</p>
                        <p>We received a request to reset your password. Click the button below to set a new password:</p>
                        
                        <p style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </p>
                        
                        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
                        
                        <p><strong>This reset link will expire in 1 hour.</strong></p>
                        
                        <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                    </div>
                    <div class="footer">
                        <p>Campus Syllabus Hub - Your Academic Resource Platform</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const text = `
Password Reset Request

Hello ${name},

We received a request to reset your password. Please visit the following link to set a new password:

${resetUrl}

This reset link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

Campus Syllabus Hub - Your Academic Resource Platform
        `;

        await this.sendEmail({
            to: email,
            subject: 'Reset Your Password - Campus Syllabus Hub',
            html,
            text,
        });
    }
}

export const emailService = new EmailService();
