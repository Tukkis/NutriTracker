import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firestore";
import { getCurrentUserId } from "../getCurrentUserId";
import { UserPlan } from "@/types/interfaces";
import { setCurrentPlan } from "./setCurrentPlan";

export async function updatePlan(userPlan: UserPlan, editPlan: (newPlan: UserPlan) => void) {
    try {

        if(!userPlan){
            throw new Error("No plan provided with updatePlan.");
        }

        const userId: string | null = getCurrentUserId();
        if (!userId) {
            throw new Error("User not authenticated.");
        }

        if (userPlan.id) {
            // If the plan already has an ID, update the existing document
            const planDocRef = doc(db, `users/${userId}/plans/${userPlan.id}`);
            await setDoc(planDocRef, {
                plan: userPlan.planData,
                userId: userPlan.userId,
            });
            console.log(`Plan updated successfully! ID: ${userPlan.id}`);

            editPlan(userPlan)
            setCurrentPlan(userPlan.id)
        } 
    } catch (error) {
        console.error("Error saving the plan: ", error);
    }
}