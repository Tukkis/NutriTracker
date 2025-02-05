import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firestore"; // Adjust the import path as per your project structure.

interface UserData {
  userId: string;
  email: string;
}

export const registerUser = async (email: string, password: string) => {
  try {
    // Register the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Prepare user data
    const userData: UserData = {
      userId,
      email,
    };

    // Add user document to Firestore
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, userData);

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
    throw error;
  }
};