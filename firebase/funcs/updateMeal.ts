import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { MealItem, UserMeal } from "@/types/interfaces";
import formatMealDate from "../helpers/formatDate";
import updateLog from "./updateLog";

export async function updateMeal(oldMeal: UserMeal| null, updatedMeal: MealItem[]) {
    if(oldMeal)
    try {
        // Format the current date for the meal
        const mealDate: string = formatMealDate(new Date());

        // Get the current user's ID
        const userId: string | null = getCurrentUserId();
        if (!userId) {
            throw new Error("User not authenticated.");
        }

        // Reference to the user's meals subcollection and specific meal document
        const mealDocRef = doc(db, `users/${userId}/meals/${oldMeal.id}`);

        // Update the meal document in the user's meals subcollection
        await updateDoc(mealDocRef, {
            userId,
            meal: updatedMeal,
            date: mealDate,
        });

        console.log("Document successfully updated!");

        // Optionally log the updated meal
        await updateLog(userId, oldMeal, updatedMeal);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}