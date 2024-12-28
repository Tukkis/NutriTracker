import { MealItem, Nutrients, UserPlan, DailyLog } from "../../types/interfaces";
import { getCurrentPlanId } from "./getCurrentPlanId"; // Import the function
import { getUsersPlans } from "./getUserPlans"; // Import the function
import { getUserDailyLogs } from "./getUserLogs"; // Import the function

// Function to calculate adherence percentage
function calculateAdherence(actual: number, goal: number): number {
  if (goal === 0) return actual === 0 ? 100 : 0;
  return Math.min(100, (actual / goal) * 100);
}

// Main function to update daily nutrition progress
async function updateDailyNutritionProgress(userId: string, mealData: MealItem[]) {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const dateString = `${day}/${month}/${year}`;

  // Get the current plan ID
  const currentPlanId = await getCurrentPlanId();
  if (!currentPlanId) {
    console.log(`No current plan for user: ${userId}`);
    return;
  }

  // Get the user's plan
  const userPlans: UserPlan[] = await getUsersPlans();
  const userPlan = userPlans.find(plan => plan.id === currentPlanId);
  if (!userPlan) {
    console.log(`No plan data found for user: ${userId}`);
    return;
  }

  const { dailyNutrients }: { dailyNutrients: Nutrients } = userPlan;

  // Aggregate total nutrients
  let totalIntake: Nutrients = {
    "energy-kcal": 0,
    carbohydrates_value: 0,
    proteins_value: 0,
    fat_value: 0,
  };

  mealData.forEach((item: MealItem) => {
    totalIntake["energy-kcal"] += item["energy-kcal"] || 0;
    totalIntake.carbohydrates_value += item.carbohydrates_value || 0;
    totalIntake.proteins_value += item.proteins_value || 0;
    totalIntake.fat_value += item.fat_value || 0;
  });

  // Calculate adherence
  const adherence: Nutrients = {
    "energy-kcal": calculateAdherence(totalIntake["energy-kcal"], dailyNutrients["energy-kcal"]),
    carbohydrates_value: calculateAdherence(totalIntake.carbohydrates_value, dailyNutrients.carbohydrates_value),
    proteins_value: calculateAdherence(totalIntake.proteins_value, dailyNutrients.proteins_value),
    fat_value: calculateAdherence(totalIntake.fat_value, dailyNutrients.fat_value),
  };

  // Fetch today's daily log
  const dailyLogs: DailyLog[] = await getUserDailyLogs(); // Ensure getUserDailyLogs is defined

  // Find the log for today's date
  const dailyLog = dailyLogs.find(log => log.date === dateString);

  // Update or create the daily log
  if (dailyLog) {
    // Update the existing daily log
    dailyLog.totalIntake = totalIntake;
    dailyLog.adherence = adherence;
    console.log(`Updated daily nutrition log for user: ${userId}`);
  } else {
    // Create a new daily log
    const newDailyLog: DailyLog = {
      date: dateString,
      totalIntake,
      dailyNutrients,
      adherence,
    };
    console.log(`Created new daily nutrition log for user: ${userId}`);
  }
}

// Example usage
const mealData: MealItem[] = [
  { product_name: "Apple", "energy-kcal": 80, carbohydrates_value: 22, proteins_value: 0, fat_value: 0, amount: 1 },
  { product_name: "Chicken Breast", "energy-kcal": 200, carbohydrates_value: 0, proteins_value: 40, fat_value: 5, amount: 1 },
];

updateDailyNutritionProgress("user123", mealData);