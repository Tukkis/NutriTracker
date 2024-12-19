import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { UserMeal, MealItem } from "@/types/interfaces";
import formatMealDate from "../helpers/formatDate";

// Function to get meals for the current user
export async function getUsersMeals(date?: Date) {
    try {
        const usersId: string | null = getCurrentUserId();
        if (!usersId) {
            console.error("No user ID found.");
            return [];
        }

        // Reference to the user's meals subcollection
        const mealsCollectionRef = collection(db, `users/${usersId}/meals`);

        let mealQuery;

        if (date) {
            // Query for meals on a specific date
            mealQuery = query(mealsCollectionRef, where("date", "==", formatMealDate(date)));
        } else {
            // Query for all meals
            mealQuery = query(mealsCollectionRef);
        }

        const querySnapshot = await getDocs(mealQuery);

        // Map the results to UserMeal type
        const meals: UserMeal[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                meals: data.meal as MealItem[],
                date: data.date,
                userId: usersId,
            };
        });

        return meals;
    } catch (error) {
        console.error("Error fetching user meals:", error);
        return [];
    }
}