import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId"; 

export const fetchUserDailyLogs = async () => {
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

        // Map the logs to an array
        const logs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return logs;
    } catch (error) {
        console.error("Error fetching logs:", error);
    }
};