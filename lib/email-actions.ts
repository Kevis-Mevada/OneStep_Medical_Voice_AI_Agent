import { auth } from "./firebase";
import { 
  sendEmailVerification, 
  sendPasswordResetEmail,
  ActionCodeSettings 
} from "firebase/auth";

// Action code settings for email links
const getActionCodeSettings = (mode: 'verifyEmail' | 'resetPassword'): ActionCodeSettings => {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return {
    // URL you want to redirect back to after email action is complete
    url: mode === 'verifyEmail' ? `${url}/login` : `${url}/login`,
    handleCodeInApp: false, // Let Firebase handle it on their page
  };
};

/**
 * Send email verification to user
 * Called after registration
 */
export async function sendVerificationEmail(user: any) {
  try {
    await sendEmailVerification(user, getActionCodeSettings('verifyEmail'));
    return { success: true };
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return { 
      success: false, 
      error: error.message || "Failed to send verification email" 
    };
  }
}

/**
 * Send password reset email
 * Called from forgot password page
 */
export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email, getActionCodeSettings('resetPassword'));
    return { success: true };
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    
    // Handle specific error codes
    if (error.code === 'auth/user-not-found') {
      // For security, don't reveal if email exists
      return { 
        success: true, // Return success to prevent email enumeration
        message: "If an account exists for this email, a reset link has been sent."
      };
    }
    
    return { 
      success: false, 
      error: error.message || "Failed to send password reset email" 
    };
  }
}

/**
 * Resend verification email
 * For users who didn't receive the first one
 */
export async function resendVerificationEmail() {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return { success: false, error: "No user signed in" };
    }
    
    if (user.emailVerified) {
      return { success: false, error: "Email already verified" };
    }
    
    await sendEmailVerification(user, getActionCodeSettings('verifyEmail'));
    return { 
      success: true,
      message: "Verification email sent successfully"
    };
  } catch (error: any) {
    console.error("Error resending verification email:", error);
    
    // Handle rate limiting
    if (error.code === 'auth/too-many-requests') {
      return {
        success: false,
        error: "Too many requests. Please wait a few minutes before trying again."
      };
    }
    
    return { 
      success: false, 
      error: error.message || "Failed to resend verification email" 
    };
  }
}
