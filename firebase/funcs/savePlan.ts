import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { PlanData, Nutrients } from "@/types/interfaces";
import calculateDailyNutrients from "../helpers/calculateDailyNutrients";

export default async function savePlan(plan: PlanData) {
    try {

        const userId: string | null = getCurrentUserId();
        if (!userId) {
            throw new Error("User not authenticated.");
        }

        const nutrients: Nutrients = calculateDailyNutrients(plan);

        const userPlansCollectionRef = collection(db, `users/${userId}/plans`);

        const docRef = await addDoc(userPlansCollectionRef, {
            userId,
            plan: plan,
            dailyNutrients: nutrients,
        });

        console.log("Document successfully written!", docRef.id);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}