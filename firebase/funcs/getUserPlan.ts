import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from "../firestore"; 
import { getCurrentUserId } from "./getCurrentUserId"; 
import { UserMeal, MealItem } from "@/types/interfaces"; 
import formatMealDate from "../helpers/formatMealDate";

// Function to get meals for the current user
export async function getUsersPlan() {
    try {
        const usersId: string | null = getCurrentUserId();
        if (!usersId) {
            console.error("No user ID found.");
            return [];
        }

        const planQuery = query(
            collection(db, "plans"),
            where("userId", "==", usersId)
        );

        const querySnapshot = await getDocs(planQuery);

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