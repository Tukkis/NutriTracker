import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from "../firestore"; 
import { getCurrentUserId } from "./getCurrentUserId"; 
import { MealItem } from "@/types/interfaces"; 

// Function to get meals for the current user
export async function getUsersMeals() {
    try {
        const userId: string | null = getCurrentUserId();
        if (!userId) {
            console.error("No user ID found.");
            return [];
        }

        const querySnapshot = await getDocs(query(
            collection(db, "meals"),
            where("user", "==", userId)
        ));

        // Map the querySnapshot to an array of meal data
        const meals: MealItem[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data().meals,
        }));

        console.log("Meals for the current user:", meals);
        return meals;
    } catch (error) {
        console.error("Error fetching meals: ", error);
        return [];
    }
}