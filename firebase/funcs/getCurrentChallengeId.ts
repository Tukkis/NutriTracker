import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../firestore";

// Function to fetch the current challenge of a user
export async function getCurrentChallengeId(userId: string): Promise<any | null> {
  try {
    const userDocRef = doc(db, "users", userId);

    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.currentChallenge || null; 
    } else {
      console.log("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user's current challenge:", error);
    return null;
  }
}