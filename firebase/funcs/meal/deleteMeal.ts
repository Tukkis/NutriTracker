import { doc, runTransaction } from "firebase/firestore";
import { db } from "../../firestore";
import { getCurrentUserId } from "../getCurrentUserId";
import { UserMeal } from "@/types/interfaces";
import updateLog from "../log/updateLog";

export async function deleteMeal(mealToDelete: UserMeal | null) {
  if (!mealToDelete) return;

  try {
    const userId: string | null = getCurrentUserId();
    if (!userId) {
      throw new Error("User not authenticated.");
    }

    const mealDocRef = doc(db, `users/${userId}/meals/${mealToDelete.id}`);

    await runTransaction(db, async (transaction) => {
      await updateLog(transaction, userId, mealToDelete, []);

      transaction.delete(mealDocRef);
    });

    console.log("Meal successfully deleted and log updated!");
  } catch (error) {
    console.error("Error deleting meal and updating log:", error);
  }
}