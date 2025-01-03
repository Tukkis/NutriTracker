import { collection, getDocs } from "firebase/firestore";
import { db } from "../firestore";
import { UserChallenge } from "@/types/interfaces"; // Import the correct type
import { getCurrentUserId } from "./getCurrentUserId";

export async function getUserChallenges(): Promise<UserChallenge[]> {
  
   // Reference to the user's challenges collection

  try {
    const userId: string | null = getCurrentUserId();
    if (!userId) {
        console.error("No user ID found.");
        return [];
    }
      
    const userChallengesRef = collection(db, `users/${userId}/challenges`);
    const challengesSnapshot = await getDocs(userChallengesRef); // Fetch all challenge documents

    if (challengesSnapshot.empty) {
      console.log("No challenges found for this user.");
      return []; // Return an empty array if no challenges are found
    }

    const userChallenges: UserChallenge[] = challengesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        challengeId: data.challengeId, 
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        duration: data.durationDays,
        dailyProgress: data.dailyProgress,
        progress: data.progress,
        lastTracked: data.lastTracked,
        completed: data.completed,
        targetNutrients: data.targetNutrients,
      };
    });

    console.log("User challenges found:", userChallenges);
    return userChallenges; // Return all user challenges as an array
  } catch (error) {
    console.error("Error fetching user challenges:", error);
    return []; // Return an empty array in case of an error
  }
}