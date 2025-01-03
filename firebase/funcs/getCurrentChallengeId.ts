import { doc, getDoc } from "firebase/firestore";
import { db } from "../firestore"; 

export async function getCurrentChallengeId(userId: string): Promise<any | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentChallenge = userData.currentChallenge || null;
      
      return currentChallenge;
    } else {
      console.log("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user's current challenge:", error);
    return null;
  }
}