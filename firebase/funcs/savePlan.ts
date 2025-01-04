import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { PlanData } from "@/types/interfaces";

export default async function savePlan(plan: PlanData) {
    try {
        const userId: string | null = getCurrentUserId();
        if (!userId) {
            throw new Error("User not authenticated.");
        }

        const userPlansCollectionRef = collection(db, `users/${userId}/plans`);

        const docRef = await addDoc(userPlansCollectionRef, {
            userId,
            plan: plan, // Plan data already contains dailyNutrients
        });

        console.log("Document successfully written!", docRef.id);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}