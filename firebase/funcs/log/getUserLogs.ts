import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firestore";
import { getCurrentUserId } from "../getCurrentUserId"; 
import { DailyLog, Nutrients } from "@/types/interfaces";  // Ensure Nutrients is imported

export const getUserDailyLogs = async (): Promise<DailyLog[]> => {
    try {
        const userId = await getCurrentUserId(); 
        if (!userId) {
            console.error("User ID not found.");
            return [];
        }

        // Reference to the user's dailyLogs subcollection
        const logsRef = collection(db, `users/${userId}/dailyLogs`);
        
        // Fetch all documents from the dailyLogs collection
        const querySnapshot = await getDocs(logsRef);

        // If no logs found
        if (querySnapshot.empty) {
            console.log("No logs found for the user.");
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