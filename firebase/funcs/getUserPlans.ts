import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from "../firestore"; 
import { getCurrentUserId } from "./getCurrentUserId"; 
import { UserPlan, PlanData, Nutrients } from "@/types/interfaces"; 

// Function to get meals for the current user
export async function getUsersPlans() {
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

        const plans: UserPlan[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                planData: data.plan as PlanData,  
                userId: data.userId,
                dailyNutrients: data.nutrients as Nutrients
            };
        });

        return plans;
    } catch (error) {
        return [];
    }
}