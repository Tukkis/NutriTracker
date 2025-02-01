import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firestore";
import { getCurrentUserId } from "../getCurrentUserId";
import { PlanData, UserChallenge, UserPlan } from "@/types/interfaces";
import { generateUserChallenge } from "../challenge/generateUserChallenge";

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
    
    console.log("userDocRef.id:", userDocRef.id);
    console.log("userId:", userId);
    console.log("docRef.id:", docRef.id);
    console.log("docRef.id === userId:", docRef.id === userId);
    console.log("docRef.id === userId:", userDocRef.id === userId);
    console.log(typeof userId, typeof docRef.id, typeof userDocRef.id);
    console.log(userDocRef.id.trim() === userId.trim());

    // Update the user's document to set the currentChallenge field
    await updateDoc(userDocRef, {
        currentPlan: docRef.id,  // Set the current challenge to the newly created challenge's ID
    });

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