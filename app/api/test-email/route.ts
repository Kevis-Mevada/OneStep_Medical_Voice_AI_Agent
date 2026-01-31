import { NextRequest, NextResponse } from "next/server";
import { sendSmtpEmail } from "@/lib/smtp-email";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json({ error: "Test email address is required" }, { status: 400 });
    }

    console.log('Testing email sending to:', testEmail);

    const subject = 'Test Email from Onestep Medical Voice AI';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>📧 Email Test Successful!</h2>
        <p>This is a test email from your Onestep Medical Voice AI application.</p>
        <p>If you received this email, your SMTP configuration is working correctly.</p>
        <div style="background-color: #e8f4f8; padding: 15px; border-left: 4px solid #0F766E; margin: 15px 0;">
          <p><strong>Configuration Status:</strong></p>
          <ul>
            <li>✅ SMTP Connection: Verified</li>
            <li>✅ Email Sending: Working</li>
            <li>✅ Environment Variables: Configured</li>
          </ul>
        </div>
        <hr>
        <p><small>This is an automated test email. If you didn't expect this, please ignore it.</small></p>
      </div>
    `;

    const result = await sendSmtpEmail(testEmail, subject, html);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: `Test email sent successfully to ${testEmail}`,
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error || "Failed to send test email",
        errorCode: result.errorCode
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send test email" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Use POST method with { testEmail: 'your-email@example.com' } to test email sending" 
  });
}