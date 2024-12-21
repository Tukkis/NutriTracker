import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { MealItem } from "../../types/interfaces";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.logDailyNutritionProgress = functions.pubsub
    .schedule("0 0 * * *") // Runs daily at midnight UTC
    .timeZone("UTC") // Adjust to your timezone if needed
    .onRun(async () => {
        try {
            const usersSnapshot = await db.collection("users").get();

            // Process each user
            for (const userDoc of usersSnapshot.docs) {
                const userId = userDoc.id;

                // Fetch the user's current plan ID
                const userDocData = userDoc.data();
                const currentPlanId = userDocData.currentPlan;
                if (!currentPlanId) {
                    console.log(`No current plan for user: ${userId}`);
                    continue;
                }

                // Fetch the current plan details
                const currentPlanRef = db.collection(`users/${userId}/plans`).doc(currentPlanId);
                const currentPlanDoc = await currentPlanRef.get();
                if (!currentPlanDoc.exists) {
                    console.log(`Plan ID ${currentPlanId} does not exist for user: ${userId}`);
                    continue;
                }

                const { dailyNutrients } = currentPlanDoc.data();

                // Generate today's date in "dd/mm/yyyy" format
                const today = new Date();
                today.setDate(today.getDate() - 1);
                const day = String(today.getDate()).padStart(2, "0");
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const year = today.getFullYear();
                const todayDateString = `${day}/${month}/${year}`;

                // Fetch today's meals for the user
                const mealsQuery = await db
                    .collection(`users/${userId}/meals`)
                    .where("date", "==", todayDateString)
                    .get();

                let totalIntake = {
                    "energy-kcal": 0,
                    carbohydrates_value: 0,
                    proteins_value: 0,
                    fat_value: 0,
                };

                mealsQuery.forEach((mealDoc: QueryDocumentSnapshot) => {
                    const mealData: { meal: MealItem[] } = mealDoc.data() as { meal: MealItem[] };
                    mealData.meal.forEach((item: MealItem) => {
                        totalIntake["energy-kcal"] += item["energy-kcal"];
                        totalIntake.carbohydrates_value += item.carbohydrates_value;
                        totalIntake.proteins_value += item.proteins_value;
                        totalIntake.fat_value += item.fat_value;
                    });
                });

                // Compare totalIntake with dailyNutrients
                const adherence = {
                    "energy-kcal": calculateAdherence(totalIntake["energy-kcal"], dailyNutrients["energy-kcal"]),
                    carbohydrates_value: calculateAdherence(totalIntake.carbohydrates_value, dailyNutrients.carbohydrates_value),
                    proteins_value: calculateAdherence(totalIntake.proteins_value, dailyNutrients.proteins_value),
                    fat_value: calculateAdherence(totalIntake.fat_value, dailyNutrients.fat_value),
                };

                // Log the adherence data
                const dailyLogRef = db.collection(`users/${userId}/dailyLogs`);
                await dailyLogRef.add({
                    date: todayDateString,
                    totalIntake,
                    dailyNutrients,
                    adherence,
                });

                console.log(`Logged adherence for user: ${userId}`);
            }
        } catch (error) {
            console.error("Error logging daily nutrition progress:", error);
        }
    });

/**
 * Calculate adherence percentage.
 * @param {number} actual
 * @param {number} goal
 * @returns {number} Percentage adherence (0-100)
 */
function calculateAdherence(actual: number, goal: number): number {
    if (goal === 0) return actual === 0 ? 100 : 0;
    return Math.min(100, (actual / goal) * 100);
}