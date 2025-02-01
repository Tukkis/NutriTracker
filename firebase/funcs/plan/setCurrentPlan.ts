import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firestore";
import { getCurrentUserId } from "../getCurrentUserId"; 

// Asettaa uuden nykyisen suunnitelman tunnisteen
export const setCurrentPlan = async (newPlanId: string): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error("User ID not found.");
      return false;
    }

    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { currentPlan: newPlanId });

    console.log("Current plan updated successfully:", newPlanId);
    return true;
  } catch (error) {
    console.error("Error setting current plan ID:", error);
    return false;
  }
};