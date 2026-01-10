import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Check if Firebase Admin credentials are configured
const isAdminConfigured = () => {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  
  if (!clientEmail || clientEmail.includes('xxxxx')) {
    return false;
  }
  if (!privateKey || privateKey.includes('YOUR_PRIVATE_KEY_HERE')) {
    return false;
  }
  return true;
};

// Initialize Firebase Admin SDK
if (!getApps().length) {
  if (!isAdminConfigured()) {
    console.error(
      '\n❌ FIREBASE ADMIN SDK NOT CONFIGURED!\n' +
      '\nTo fix this error:\n' +
      '1. Go to: https://console.firebase.google.com/project/medical-voice-ai-53005/settings/serviceaccounts/adminsdk\n' +
      '2. Click "Generate New Private Key"\n' +
      '3. Update .env.local with the credentials from the downloaded JSON\n' +
      '4. Restart the dev server\n'
    );
    throw new Error('Firebase Admin SDK credentials not configured. See console for instructions.');
  }

  try {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      } as ServiceAccount),
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
}

export const adminDb = getFirestore();
