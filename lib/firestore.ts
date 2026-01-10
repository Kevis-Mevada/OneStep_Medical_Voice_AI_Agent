import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

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
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
  isEmergency?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin";
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
  lastLogin?: Timestamp | ReturnType<typeof serverTimestamp>;
}

// Consultation Functions
export async function saveConsultation(data: Omit<ConsultationData, "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, "consultations"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving consultation:", error);
    return { success: false, error };
  }
}

export async function getUserConsultations(userId: string) {
  try {
    const q = query(
      collection(db, "consultations"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const consultations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, consultations };
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return { success: false, error, consultations: [] };
  }
}

export async function getConsultationById(consultationId: string, userId: string) {
  try {
    const docRef = doc(db, "consultations", consultationId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Consultation not found" };
    }

    const data = docSnap.data();
    
    // Verify user owns this consultation
    if (data.userId !== userId) {
      return { success: false, error: "Unauthorized access" };
    }

    return { success: true, consultation: { id: docSnap.id, ...data } };
  } catch (error) {
    console.error("Error fetching consultation:", error);
    return { success: false, error };
  }
}

export async function deleteConsultation(consultationId: string, userId: string) {
  try {
    const docRef = doc(db, "consultations", consultationId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Consultation not found" };
    }

    const data = docSnap.data();
    
    // Verify user owns this consultation
    if (data.userId !== userId) {
      return { success: false, error: "Unauthorized access" };
    }

    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting consultation:", error);
    return { success: false, error };
  }
}

// User Profile Functions
export async function createUserProfile(profile: UserProfile) {
  try {
    await addDoc(collection(db, "users"), {
      ...profile,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error };
  }
}

export async function getUserProfile(uid: string) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: "Profile not found" };
    }

    const userDoc = querySnapshot.docs[0];
    return { success: true, profile: { id: userDoc.id, ...userDoc.data() } };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error };
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: "Profile not found" };
    }

    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "users", userDoc.id), data);
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }
}

// Admin Functions
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error, users: [] };
  }
}

export async function getAllConsultations() {
  try {
    const q = query(collection(db, "consultations"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const consultations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, consultations };
  } catch (error) {
    console.error("Error fetching all consultations:", error);
    return { success: false, error, consultations: [] };
  }
}

export async function getConsultationStats() {
  try {
    const consultationsSnapshot = await getDocs(collection(db, "consultations"));
    const usersSnapshot = await getDocs(collection(db, "users"));
    
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
