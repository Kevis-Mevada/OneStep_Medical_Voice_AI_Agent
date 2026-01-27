import { NextRequest, NextResponse } from "next/server";
import { sendSmtpEmail } from "@/lib/smtp-email";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (action === "initiate-reset") {
      // Send a custom email via SMTP that explains the next step
      const subject = 'Password Reset Request - Onestep Medical Voice AI';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset the password for your Onestep Medical Voice AI account.</p>
          <p>To continue with the password reset process, we have sent a secure reset link directly from Firebase to your email address. Please check your inbox (and spam folder) for an email from Firebase Authentication.</p>
          <p><strong>Important:</strong> For security reasons, the password reset must be completed through the official Firebase link.</p>
          <hr>
          <p><small>If you did not request a password reset, please ignore this email and secure your account.</small></p>
        </div>
      `;

      // Send our custom notification email
      const notifyResult = await sendSmtpEmail(email, subject, html);

      if (!notifyResult.success) {
        console.error("Failed to send notification email:", notifyResult.error);
        // Still attempt Firebase reset even if our notification fails
      }

      try {
        // Trigger Firebase's built-in password reset flow
        await sendPasswordResetEmail(auth, email);

        return NextResponse.json({ 
          success: true, 
          message: "Password reset instructions have been sent to your email. Please check your inbox." 
        });
      } catch (firebaseError: any) {
        console.error("Firebase password reset error:", firebaseError);
        return NextResponse.json({ 
          success: false, 
          error: "Could not initiate password reset. Please try again." 
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process password reset" },
      { status: 500 }
    );
  }
}