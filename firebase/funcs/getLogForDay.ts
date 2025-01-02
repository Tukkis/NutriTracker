import { doc, getDoc } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { DailyLog, Nutrients } from "@/types/interfaces";

// Helper function to get today's date in YYYY-MM-DD format
export const getLogForDay = async (): Promise<DailyLog | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error("User ID not found.");
      return null;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateString = `${day}-${month}-${year}`;

    // Reference to the user's dailyLogs subcollection
    const logRef = doc(db, `users/${userId}/dailyLogs/${dateString}`);

    // Fetch the document
    const docSnapshot = await getDoc(logRef);

    if (!docSnapshot.exists()) {
      console.log("No log found for today.");
      return null;
    }


    // Map the logs to an array, ensuring correct typing and including all necessary fields
    const data = docSnapshot.data();
      const dailyLog: DailyLog = {
        date: data.date,
        totalIntake: data.totalIntake as Nutrients,
        dailyNutrients: data.dailyNutrients as Nutrients,
        adherence: data.adherence as Nutrients,
        plan: data.plan,
        score: data.score,
      };
      return dailyLog;
    } catch (error) {
      console.error("Error fetching today's log:", error);
      return null;
    }
  };