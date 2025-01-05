import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firestore";
import { UserPlan, DailyLog, Nutrients, MealItem, UserMeal } from "../../types/interfaces";
import { getUsersPlanById } from "./getPlanById";
import { getLogForDay } from "./getLogForDay";
import { updateUserScore } from "./updateUserScore";
import { calculateScore } from "../helpers/calculateScore";

function calculateAdherence(actual: number, goal: number): number {
  if (goal === 0) return actual === 0 ? 100 : 0;
  return Math.min(100, (actual / goal) * 100);
}

async function updateLog(userId: string, oldMeal: UserMeal, updatedMeal: MealItem[]) {
  //Get log for day
  const mealsLog: DailyLog | null = await getLogForDay(oldMeal.date)

  if (!mealsLog) {
    console.log(`No log found`);
    return;
  }

  const userPlan : UserPlan | null = await getUsersPlanById(mealsLog.plan)

  if (!userPlan) {
    console.log(`No plan found`);
    return;
  }

  const { dailyNutrients }: { dailyNutrients: Nutrients } = userPlan.planData;

  // Aggregate total nutrients for the meal data
  let totalIntake: Nutrients = {
    "energy-kcal": 0,
    carbohydrates_value: 0,
    proteins_value: 0,
    fat_value: 0,
  };

  updatedMeal.forEach((item: MealItem) => {
    const amountInGrams = item.amount;

    totalIntake["energy-kcal"] += (item["energy-kcal"] * amountInGrams) / 100;
    totalIntake.carbohydrates_value += (item.carbohydrates_value * amountInGrams) / 100;
    totalIntake.proteins_value += (item.proteins_value * amountInGrams) / 100;
    totalIntake.fat_value += (item.fat_value * amountInGrams) / 100;
  });

  oldMeal.meals.forEach((item: MealItem) => {
    const amountInGrams = item.amount;  

    totalIntake["energy-kcal"] -= (item["energy-kcal"] * amountInGrams) / 100;
    totalIntake.carbohydrates_value -= (item.carbohydrates_value * amountInGrams) / 100;
    totalIntake.proteins_value -= (item.proteins_value * amountInGrams) / 100;
    totalIntake.fat_value -= (item.fat_value * amountInGrams) / 100;
  });

  const logsRef = doc(db, `users/${userId}/dailyLogs/${oldMeal.date}`);

  try {
    if (mealsLog) {
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

      const updatedScore = calculateScore(updatedAdherence)

      await updateDoc(logsRef, { 
        totalIntake: updatedTotalIntake, 
        adherence: updatedAdherence,
        score: updatedScore,
      });

      updateUserScore((updatedScore - mealsLog.score) / 10)

      console.log(`Updated daily nutrition log for user: ${userId}`);
    } else {
      console.log(`Failed to update log for ${oldMeal.date}.`);
    }
  } catch (error) {
    console.error("Error updating daily log in Firestore:", error);
  }
}

export default updateLog;