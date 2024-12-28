import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";
import { MealItem, Nutrients } from "../../types/interfaces";
import * as admin from "firebase-admin";
const functions = require('firebase-functions');

admin.initializeApp();
const db = admin.firestore();

// Firestore trigger for when a new meal is added to a user's meals collection
exports.updateDailyNutritionProgress = functions.firestore
  .document('users/{userId}/meals/{mealId}') // Triggered when a new meal is added or updated
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    const mealId = context.params.mealId;

    // Get the meal data from the changed document
    const mealData = change.after.exists ? change.after.data() : null;

    if (!mealData) {
      console.log(`Meal document ${mealId} no longer exists`);
      return null;
    }

    // Calculate the date for logging
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateString = `${day}/${month}/${year}`;

    // Get the user's plan and daily nutrients
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    const userDocData = userDoc.data();

    if (!userDocData || !userDocData.currentPlan) {
      console.log(`No current plan for user: ${userId}`);
      return null;
    }

    const currentPlanRef = db.collection(`users/${userId}/plans`).doc(userDocData.currentPlan);
    const currentPlanDoc = await currentPlanRef.get();

    if (!currentPlanDoc.exists) {
      console.log(`Plan ID ${userDocData.currentPlan} does not exist for user: ${userId}`);
      return null;
    }

    const { dailyNutrients }: { dailyNutrients: Nutrients } = currentPlanDoc.data() as any;

    // Fetch today's daily log
    const dailyLogRef = db.collection(`users/${userId}/dailyLogs`).where('date', '==', dateString);
    const dailyLogSnapshot = await dailyLogRef.get();

    // Fetch the meals logged for the current day
    const mealsSnapshot = await db.collection(`users/${userId}/meals`).where('date', '==', dateString).get();

    // Aggregate total nutrients
    let totalIntake: Nutrients = {
      "energy-kcal": 0,
      carbohydrates_value: 0,
      proteins_value: 0,
      fat_value: 0,
    };

    mealsSnapshot.forEach((mealDoc: QueryDocumentSnapshot<DocumentData>) => {
      const mealData: { meal: MealItem[] } = mealDoc.data() as { meal: MealItem[] };
      mealData.meal.forEach((item: MealItem) => {
        totalIntake["energy-kcal"] += item["energy-kcal"] || 0;
        totalIntake.carbohydrates_value += item.carbohydrates_value || 0;
        totalIntake.proteins_value += item.proteins_value || 0;
        totalIntake.fat_value += item.fat_value || 0;
      });
    });

    // Calculate adherence
    const adherence = {
      "energy-kcal": calculateAdherence(totalIntake["energy-kcal"], dailyNutrients["energy-kcal"]),
      carbohydrates_value: calculateAdherence(totalIntake.carbohydrates_value, dailyNutrients.carbohydrates_value),
      proteins_value: calculateAdherence(totalIntake.proteins_value, dailyNutrients.proteins_value),
      fat_value: calculateAdherence(totalIntake.fat_value, dailyNutrients.fat_value),
    };

    // Update or create the daily log
    if (!dailyLogSnapshot.empty) {
      // If a log for today exists, update it
      const dailyLogDoc = dailyLogSnapshot.docs[0];
      await dailyLogDoc.ref.update({
        totalIntake,
        adherence,
      });
      console.log(`Updated daily nutrition log for user: ${userId}`);
    } else {
      // If no log for today exists, create a new one
      await db.collection(`users/${userId}/dailyLogs`).add({
        date: dateString,
        totalIntake,
        dailyNutrients,
        adherence,
      });
      console.log(`Created new daily nutrition log for user: ${userId}`);
    }

    return null;
  });

/**
 * Calculate adherence percentage.
 * @param {number} actual - Actual value logged.
 * @param {number} goal - Target value from the plan.
 * @returns {number} Percentage adherence (0-100).
 */
function calculateAdherence(actual: number, goal: number): number {
  if (goal === 0) return actual === 0 ? 100 : 0;
  return Math.min(100, (actual / goal) * 100);
}
