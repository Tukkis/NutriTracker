import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firestore";
import { getCurrentUserId } from "../getCurrentUserId";
import { UserPlan, PlanData, Nutrients } from "@/types/interfaces";

export async function getUsersPlanById(planId: string): Promise<UserPlan | null> {
  try {
    const usersId: string | null = await getCurrentUserId();
    if (!usersId) {
      console.error("No user ID found.");
      return null;
    }

    // Reference to the specific plan document
    const planDocRef = doc(db, `users/${usersId}/plans/${planId}`);

    // Fetch the document
    const docSnapshot = await getDoc(planDocRef);

    if (!docSnapshot.exists()) {
      console.log(`No plan found with ID: ${planId}`);
      return null;
    }

    // Map the document data to a UserPlan object
    const data = docSnapshot.data();
    const userPlan: UserPlan = {
      id: docSnapshot.id,
      planData: {
        ...data.plan
      } as PlanData,
      userId: usersId, 
    };

    return userPlan;
  } catch (error) {
    console.error("Error fetching user plan by ID:", error);
    return null;
  }
}