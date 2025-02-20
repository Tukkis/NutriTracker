import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firestore";
import { getCurrentUserId } from "../getCurrentUserId";
import { PlanData, UserChallenge, UserPlan } from "@/types/interfaces";
import { generateUserChallenge } from "../challenge/generateUserChallenge";
import { setCurrentPlan } from "./setCurrentPlan";

export default async function savePlan(plan: PlanData, addPlan: (newPlan: UserPlan) => void, addChallenge: (challenge: UserChallenge) => void) {
  try {
    const userId: string | null = getCurrentUserId();
    if (!userId) {
      throw new Error("User not authenticated.");
    }

    const userPlansCollectionRef = collection(db, `users/${userId}/plans`);

    // Save the plan to Firestore
    const docRef = await addDoc(userPlansCollectionRef, {
      userId,
      plan, // Plan data already contains dailyNutrients
    });

    // Create the new plan object with the generated Firestore ID
    const newPlan: UserPlan = {
      id: docRef.id,
      userId,
      planData: plan,
    };

    // Add the new plan to the state using the addPlan function
    addPlan(newPlan);

    const userDocRef = doc(db, `users/${userId}`);
    
    setCurrentPlan(docRef.id)
    console.log("User's current challenge updated!");

    const generatedChallenge = await generateUserChallenge(newPlan)
    if(generatedChallenge){
      addChallenge(generatedChallenge)
    }
    
    console.log("Document successfully written!", docRef.id);
  } catch (error) {
    console.error("Error writing document:", error);
  }
}