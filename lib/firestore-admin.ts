import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export interface ConsultationData {
  userId: string;
  userEmail: string;
  gender?: string;
  age?: string;
  height?: string;
  weight?: string;
  conditions?: string;
  symptoms: string;
  aiResponse: string;
  report: string;
  createdAt: any;
  isEmergency?: boolean;
}

export async function saveConsultationAdmin(data: Omit<ConsultationData, "createdAt">) {
  try {
    const docRef = await adminDb.collection("consultations").add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error saving consultation:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserRecentConsultations(userId: string, limit: number = 3) {
  try {
    const snapshot = await adminDb
      .collection("consultations")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const consultations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, consultations };
  } catch (error: any) {
    console.error("Error fetching recent consultations:", error);
    return { success: false, error: error.message, consultations: [] };
  }
}

/**
 * Get consultation by ID (server-side)
 */
export async function getConsultationByIdAdmin(consultationId: string, userId: string) {
  try {
    const docRef = adminDb.collection("consultations").doc(consultationId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return { success: false, error: "Consultation not found" };
    }

    const data = docSnap.data();
    
    // Verify user owns this consultation
    if (data?.userId !== userId) {
      return { success: false, error: "Unauthorized access" };
    }

    return { success: true, consultation: { id: docSnap.id, ...data } };
  } catch (error) {
    console.error("Error fetching consultation:", error);
    return { success: false, error };
  }
}

/**
 * Get user consultations (server-side)
 */
export async function getUserConsultationsAdmin(userId: string) {
  try {
    const snapshot = await adminDb
      .collection("consultations")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const consultations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, consultations };
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return { success: false, error, consultations: [] };
  }
}

/**
 * Get all consultations (admin only, server-side)
 */
export async function getAllConsultationsAdmin() {
  try {
    const snapshot = await adminDb
      .collection("consultations")
      .orderBy("createdAt", "desc")
      .get();

    const consultations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, consultations };
  } catch (error) {
    console.error("Error fetching all consultations:", error);
    return { success: false, error, consultations: [] };
  }
}

/**
 * Delete consultation (server-side)
 */
export async function deleteConsultationAdmin(consultationId: string, userId: string) {
  try {
    const docRef = adminDb.collection("consultations").doc(consultationId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return { success: false, error: "Consultation not found" };
    }

    const data = docSnap.data();
    
    // Verify user owns this consultation
    if (data?.userId !== userId) {
      return { success: false, error: "Unauthorized access" };
    }

    await docRef.delete();
    return { success: true };
  } catch (error) {
    console.error("Error deleting consultation:", error);
    return { success: false, error };
  }
}

/**
 * Get user profile (server-side)
 */
export async function getUserProfileAdmin(uid: string) {
  try {
    const snapshot = await adminDb
      .collection("users")
      .where("uid", "==", uid)
      .get();
    
    if (snapshot.empty) {
      return { success: false, error: "Profile not found" };
    }

    const userDoc = snapshot.docs[0];
    return { success: true, profile: { id: userDoc.id, ...userDoc.data() } };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error };
  }
}

/**
 * Update user profile (server-side)
 */
export async function updateUserProfileAdmin(uid: string, data: any) {
  try {
    const snapshot = await adminDb
      .collection("users")
      .where("uid", "==", uid)
      .get();
    
    if (snapshot.empty) {
      return { success: false, error: "Profile not found" };
    }

    const userDoc = snapshot.docs[0];
    await adminDb.collection("users").doc(userDoc.id).update(data);
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }
}

/**
 * Get all users (admin only, server-side)
 */
export async function getAllUsersAdmin() {
  try {
    const snapshot = await adminDb.collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error, users: [] };
  }
}

/**
 * Get consultation stats (admin only, server-side)
 */
export async function getConsultationStatsAdmin() {
  try {
    const consultationsSnapshot = await adminDb.collection("consultations").get();
    const usersSnapshot = await adminDb.collection("users").get();
    
    const totalConsultations = consultationsSnapshot.size;
    const totalUsers = usersSnapshot.size;
    
    // Count emergency consultations
    let emergencyCount = 0;
    consultationsSnapshot.forEach((doc) => {
      if (doc.data().isEmergency) {
        emergencyCount++;
      }
    });

    return {
      success: true,
      stats: {
        totalConsultations,
        totalUsers,
        emergencyCount,
      },
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, error };
  }
}