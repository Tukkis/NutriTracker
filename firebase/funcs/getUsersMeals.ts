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

        let mealQuery;

        if (date) {
            // Calculate start and end of the current day

            mealQuery = query(
                collection(db, "meals"),
                where("userId", "==", usersId),
                where("date", "==", formatMealDate(date))
            );
        } else {
            mealQuery = query(
                collection(db, "meals"),
                where("userId", "==", usersId)
            );
        }

        const querySnapshot = await getDocs(mealQuery);

        const meals: UserMeal[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                meals: data.meal as MealItem[],  
                date: data.date, 
                userId: data.userId
            };
        });

        return meals;
    } catch (error) {
        return [];
    }
}