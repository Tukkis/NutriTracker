import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { UserPlan, PlanData, Nutrients } from "@/types/interfaces";


export async function getUsersPlans() {
    try {
        const usersId: string | null = getCurrentUserId();
        if (!usersId) {
            console.error("No user ID found.");
            return [];
        }

        // Reference to the user's plans subcollection
        const plansCollectionRef = collection(db, `users/${usersId}/plans`);

        // Query the plans subcollection
        const planQuery = query(plansCollectionRef);

        const querySnapshot = await getDocs(planQuery);

        // Map the documents to the UserPlan type
        const plans: UserPlan[] = querySnapshot.docs.map(doc => {
            const data = doc.data();

            return {
              id: doc.id,
              planData: {
                ...data.plan
              } as PlanData,
              userId: usersId,
            };
        });

        return plans;
    } catch (error) {
        console.error("Error fetching user plans:", error);
        return [];
    }
}