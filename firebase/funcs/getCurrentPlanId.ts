import { doc, getDoc } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId"; 

export const getCurrentPlanId = async (): Promise<string | null> => {
  try {
    const userId = await getCurrentUserId(); 
    if (!userId) {
      console.error("User ID not found.");
      return null;
    }

    const userDocRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();

      const currentPlanId = userData.currentPlan;

      if (currentPlanId) {
        console.log("Current Plan ID:", currentPlanId);
        return currentPlanId; 
      } else {
        console.error("No current plan set for this user.");
        return null;
      }
    } else {
      console.error("User document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching current plan ID:", error);
    return null;
  }
};