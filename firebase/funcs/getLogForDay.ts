import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { DailyLog, Nutrients } from "@/types/interfaces";

export const getLatestLog = async (): Promise<DailyLog | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error("User ID not found.");
      return null;
    }

    // Reference to the user's dailyLogs subcollection
    const dailyLogsRef = collection(db, `users/${userId}/dailyLogs`);

    // Query to get the latest log (ordering by the date field in descending order)
    const latestLogQuery = query(dailyLogsRef, orderBy("date", "desc"), limit(1));

    // Fetch the documents
    const querySnapshot = await getDocs(latestLogQuery);

    if (querySnapshot.empty) {
      console.log("No logs found.");
      return null;
    }

    // Extract the latest document
    const docSnapshot = querySnapshot.docs[0];
    const data = docSnapshot.data();

    // Map the data to a DailyLog object
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
    console.error("Error fetching the latest log:", error);
    return null;
  }
};