import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { PlanData, Nutrients } from "@/types/interfaces";
import formatMealDate from "../helpers/formatDate";
import calculateDailyNutrients from "../helpers/calculateDailyNutrients";

export default async function savePlan(plan: PlanData) {
    try {
        const startDate: string = formatMealDate(plan.startDate);
        const endDate: string = formatMealDate(plan.endDate);
        const userId: string | null = getCurrentUserId();
        if (!userId) {
            throw new Error("User not authenticated.");
        }

        // Calculate daily nutrients
        const nutrients: Nutrients = calculateDailyNutrients(plan);

        // Format the plan data
        const formattedPlan = {
            ...plan,
            startDate,
            endDate,
        };

        // Reference to the user's plans subcollection
        const userPlansCollectionRef = collection(db, `users/${userId}/plans`);

        // Add the plan document to the subcollection
        const docRef = await addDoc(userPlansCollectionRef, {
            userId,
            plan: formattedPlan,
            dailyNutrients: nutrients,
        });

        console.log("Document successfully written!", docRef.id);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}