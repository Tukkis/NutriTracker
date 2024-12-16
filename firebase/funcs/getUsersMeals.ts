import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from "../firestore"; 
import { getCurrentUserId } from "./getCurrentUserId"; 
import { UserMeal, MealItem } from "@/types/interfaces"; 

// Function to get meals for the current user
export async function getUsersMeals() {
    try {
        const usersId: string | null = getCurrentUserId();
        if (!usersId) {
            console.error("No user ID found.");
            return [];
        }

        const querySnapshot = await getDocs(query(
            collection(db, "meals"),
            where("userId", "==", usersId)
        ));

        const meals: UserMeal[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                meals: data.meal as MealItem[],  
                date: data.date ? data.date.toDate() : new Date(), 
                userId: data.userId
            };
        });

        console.log(meals)

        return meals;
    } catch (error) {
        return [];
    }
}