import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId"; 
import { DailyLog, Nutrients } from "@/types/interfaces";  // Ensure Nutrients is imported

export const getPlanLogs = async (planId: string | null): Promise<DailyLog[]> => {
    try {
        const userId = await getCurrentUserId(); 
        if (!userId) {
            console.error("User ID not found.");
            return [];
        }

        // Reference to the user's dailyLogs subcollection
        const logsRef = collection(db, `users/${userId}/dailyLogs`);

        // Create a query to fetch logs with the specific plan ID
        const dailyLogQuery = query(logsRef, where("plan", "==", planId));

        // Fetch the documents based on the query
        const querySnapshot = await getDocs(dailyLogQuery);

        // If no logs found
        if (querySnapshot.empty) {
            console.log(`No logs found for the user with plan: ${planId}`);
            return [];
        }

        // Map the logs to an array, ensuring correct typing and including all necessary fields
        const logs: DailyLog[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const dailyLog: DailyLog = {
                date: data.date,  
                totalIntake: data.totalIntake as Nutrients,  
                dailyNutrients: data.dailyNutrients as Nutrients,  
                adherence: data.adherence as Nutrients,  
                plan: data.plan,
                score: data.score
            };
            return dailyLog;
        });

        return logs;
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];  // Return an empty array in case of an error
    }
};