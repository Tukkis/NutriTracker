import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firestore";
import { getCurrentUserId } from "../getCurrentUserId";
import { DailyLog, Nutrients } from "@/types/interfaces";

export const getLogForDay = async (dateString: string): Promise<DailyLog | null> => {

  

  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error("User ID not found.");
      return null;
    }

    const formattedDate = dateString.replace(/\//g, "-");

    // Reference to the user's dailyLogs subcollection
    const dailyLogsRef = collection(db, `users/${userId}/dailyLogs`);

    // Query to get the log for the specific date (using where to filter by dateString)
    const dailyLogQuery = query(dailyLogsRef, where("date", "==", formattedDate));

    // Fetch the documents
    const querySnapshot = await getDocs(dailyLogQuery);

    if (querySnapshot.empty) {
      console.log(`No logs found for the date ${formattedDate}.`);
      return null;
    }

    // Extract the document data
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
    console.error("Error fetching the log for the specified date:", error);
    return null;
  }
};