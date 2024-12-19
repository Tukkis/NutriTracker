import { doc, addDoc, collection } from "firebase/firestore"; 
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
        const nutrients : Nutrients = calculateDailyNutrients(plan)
        const formattedPlan = {
            ...plan,
            startDate: startDate, 
            endDate: endDate,    
        };
        const docRef = await addDoc(collection(db, "plans"), {
            userId: userId,
            plan: formattedPlan,
            dailyNutrients: nutrients
        });
        console.log("Document successfully written!", docRef.id);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}