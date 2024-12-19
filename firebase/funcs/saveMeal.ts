import { doc, addDoc, collection } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { MealItem } from "@/types/interfaces";
import formatMealDate from "../helpers/formatDate";

export default async function saveMeal(meal: MealItem[]) {
    try {
        // Format the current date for the meal
        const mealDate: string = formatMealDate(new Date());

        // Get the current user's ID
        const userId: string | null = getCurrentUserId();
        if (!userId) {
            throw new Error("User not authenticated.");
        }

        // Reference to the user's meals subcollection
        const userMealsCollectionRef = collection(db, `users/${userId}/meals`);

        // Add the meal document to the user's meals subcollection
        const docRef = await addDoc(userMealsCollectionRef, {
            userId,
            meal,
            date: mealDate,
        });

        console.log("Document successfully written!", docRef.id);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}