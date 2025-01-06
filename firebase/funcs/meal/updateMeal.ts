import { doc, runTransaction } from "firebase/firestore";
import { db } from "../../firestore";
import { getCurrentUserId } from "../getCurrentUserId";
import { MealItem, UserMeal } from "@/types/interfaces";
import updateLog from "../log/updateLog";

export async function updateMeal(oldMeal: UserMeal | null, updatedMeal: MealItem[]) {
  if (!oldMeal) return;

  try {
    const userId: string | null = getCurrentUserId();
    if (!userId) {
      throw new Error("User not authenticated.");
    }

    const mealDocRef = doc(db, `users/${userId}/meals/${oldMeal.id}`);

    await runTransaction(db, async (transaction) => {
      await updateLog(transaction, userId, oldMeal, updatedMeal);

      // Update the meal document within the transaction
      transaction.update(mealDocRef, {
        userId,
        meal: updatedMeal,
        date: new Date().toISOString(), // Replace with your date formatter if needed
      });
    });

    console.log("Meal and log successfully updated!");
  } catch (error) {
    console.error("Error updating meal and log:", error);
  }
}