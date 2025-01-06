import { doc } from "firebase/firestore";
import { db } from "../../firestore";
import { DailyLog, MealItem, Nutrients, UserMeal } from "@/types/interfaces";
import { getUsersPlanById } from "../plan/getPlanById";
import { calculateScore } from "../../helpers/calculateScore";
import { calculateAdherence } from "../../helpers/caclulateAdherence";

export default async function updateLog(
  transaction: any,
  userId: string,
  oldMeal: UserMeal,
  updatedMeal: MealItem[]
) {
  const logsRef = doc(db, `users/${userId}/dailyLogs/${oldMeal.date.replace(/\//g, "-")}`);

  // Get the log document snapshot
  const logSnapshot = await transaction.get(logsRef);
  if (!logSnapshot.exists()) {
    throw new Error("No daily log found.");
  }

  const mealsLog = logSnapshot.data() as DailyLog;

  // Get user plan
  const userPlan = await getUsersPlanById(mealsLog.plan);
  if (!userPlan) {
    throw new Error("No user plan found.");
  }

  const { dailyNutrients } = userPlan.planData;

  // Aggregate nutrient changes
  let totalIntake: Nutrients = {
    "energy-kcal": 0,
    carbohydrates_value: 0,
    proteins_value: 0,
    fat_value: 0,
  };

  updatedMeal.forEach((item) => {
    const amountInGrams = item.amount;
    totalIntake["energy-kcal"] += (item["energy-kcal"] * amountInGrams) / 100;
    totalIntake.carbohydrates_value += (item.carbohydrates_value * amountInGrams) / 100;
    totalIntake.proteins_value += (item.proteins_value * amountInGrams) / 100;
    totalIntake.fat_value += (item.fat_value * amountInGrams) / 100;
  });

  oldMeal.meals.forEach((item) => {
    const amountInGrams = item.amount;
    totalIntake["energy-kcal"] -= (item["energy-kcal"] * amountInGrams) / 100;
    totalIntake.carbohydrates_value -= (item.carbohydrates_value * amountInGrams) / 100;
    totalIntake.proteins_value -= (item.proteins_value * amountInGrams) / 100;
    totalIntake.fat_value -= (item.fat_value * amountInGrams) / 100;
  });

  // Update log totals
  const updatedTotalIntake: Nutrients = {
    "energy-kcal": mealsLog.totalIntake["energy-kcal"] + totalIntake["energy-kcal"],
    carbohydrates_value: mealsLog.totalIntake.carbohydrates_value + totalIntake.carbohydrates_value,
    proteins_value: mealsLog.totalIntake.proteins_value + totalIntake.proteins_value,
    fat_value: mealsLog.totalIntake.fat_value + totalIntake.fat_value,
  };

  const updatedAdherence: Nutrients = {
    "energy-kcal": calculateAdherence(updatedTotalIntake["energy-kcal"], dailyNutrients["energy-kcal"]),
    carbohydrates_value: calculateAdherence(updatedTotalIntake.carbohydrates_value, dailyNutrients.carbohydrates_value),
    proteins_value: calculateAdherence(updatedTotalIntake.proteins_value, dailyNutrients.proteins_value),
    fat_value: calculateAdherence(updatedTotalIntake.fat_value, dailyNutrients.fat_value),
  };

  const updatedScore = calculateScore(updatedAdherence);

  // Update the log document within the transaction
  transaction.update(logsRef, {
    totalIntake: updatedTotalIntake,
    adherence: updatedAdherence,
    score: updatedScore,
  });
}