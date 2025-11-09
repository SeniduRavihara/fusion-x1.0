import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config";

type Registration = {
  email: string;
  name: string;
  whatsapp: string;
  faculty: string;
  year: string;
};

class UserService {
  /**
   * Check if an email is already registered.
   */
  static async isEmailRegistered(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, "registrations"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("UserService.isEmailRegistered error:", error);
      throw error;
    }
  }

  /**
   * Store a registration entry in Firestore.
   * Uses a `registrations` collection so we keep signups separated from authenticated users.
   */
  static async register(payload: Registration) {
    try {
      const docRef = await addDoc(collection(db, "registrations"), {
        ...payload,
        createdAt: serverTimestamp(),
        isEmailSent: false,
      });

      return { id: docRef.id };
    } catch (error) {
      console.error("UserService.register error:", error);
      throw error;
    }
  }

  /**
   * Check if email has been sent for a user.
   */
  static async isEmailSent(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, "registrations"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return false;
      }

      const userData = querySnapshot.docs[0].data();
      return userData.isEmailSent === true;
    } catch (error) {
      console.error("UserService.isEmailSent error:", error);
      throw error;
    }
  }

  /**
   * Mark email as sent for a user.
   */
  static async markEmailAsSent(email: string): Promise<void> {
    try {
      const q = query(
        collection(db, "registrations"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          isEmailSent: true,
          emailSentAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("UserService.markEmailAsSent error:", error);
      throw error;
    }
  }
}

export default UserService;
