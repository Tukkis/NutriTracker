import { MealItem, Nutrients, UserPlan, DailyLog } from "../../../types/interfaces";
import { getCurrentPlanId } from "../plan/getCurrentPlanId"; 
import { getUsersPlans } from "../plan/getUserPlans"; 
import { getUserDailyLogs } from "./getUserLogs"; 
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firestore"; 
import { updateUserScore } from "../updateUserScore";
import { calculateScore } from "../../helpers/calculateScore";
import { calculateAdherence } from "../../helpers/caclulateAdherence";

async function logMeal(userId: string, mealData: MealItem[]) {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const dateString = `${day}-${month}-${year}`;

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

  const { dailyNutrients }: { dailyNutrients: Nutrients } = userPlan.planData;

  // Aggregate total nutrients for the meal data
  let totalIntake: Nutrients = {
    "energy-kcal": 0,
    carbohydrates_value: 0,
    proteins_value: 0,
    fat_value: 0,
  };
  
  // Loop over meal data and multiply by amount/100 to get correct nutrient intake
  mealData.forEach((item: MealItem) => {
    const amountInGrams = item.amount;  // The actual amount in grams
  
    totalIntake["energy-kcal"] += (item["energy-kcal"] * amountInGrams) / 100;
    totalIntake.carbohydrates_value += (item.carbohydrates_value * amountInGrams) / 100;
    totalIntake.proteins_value += (item.proteins_value * amountInGrams) / 100;
    totalIntake.fat_value += (item.fat_value * amountInGrams) / 100;
  });


  // Fetch today's daily log
  const dailyLogs: DailyLog[] = await getUserDailyLogs(); // Ensure getUserDailyLogs is defined

  // Find the log for today's date
  const dailyLog = dailyLogs.find(log => log.date === dateString);

  // Reference to the user's dailyLogs subcollection
  const logsRef = doc(db, `users/${userId}/dailyLogs/${dateString}`);

  try {
    if (dailyLog) {
      // If log for today exists, accumulate the nutrients and recalculate adherence
      const updatedTotalIntake: Nutrients = {
        "energy-kcal": dailyLog.totalIntake["energy-kcal"] + totalIntake["energy-kcal"],
        carbohydrates_value: dailyLog.totalIntake.carbohydrates_value + totalIntake.carbohydrates_value,
        proteins_value: dailyLog.totalIntake.proteins_value + totalIntake.proteins_value,
        fat_value: dailyLog.totalIntake.fat_value + totalIntake.fat_value,
      };

      const updatedAdherence: Nutrients = {
        "energy-kcal": calculateAdherence(updatedTotalIntake["energy-kcal"], dailyNutrients["energy-kcal"]),
        carbohydrates_value: calculateAdherence(updatedTotalIntake.carbohydrates_value, dailyNutrients.carbohydrates_value),
        proteins_value: calculateAdherence(updatedTotalIntake.proteins_value, dailyNutrients.proteins_value),
        fat_value: calculateAdherence(updatedTotalIntake.fat_value, dailyNutrients.fat_value),
      };

      const updatedScore = calculateScore(updatedAdherence)

      // Update the existing daily log with the accumulated nutrients and recalculated adherence
      await setDoc(logsRef, { 
        totalIntake: updatedTotalIntake, 
        adherence: updatedAdherence,
        score: updatedScore,
      }, { merge: true });

      updateUserScore((updatedScore - dailyLog.score)/ 10)

      console.log(`Updated daily nutrition log for user: ${userId}`);
    } else {
      const adherence: Nutrients = {
        "energy-kcal": calculateAdherence(totalIntake["energy-kcal"], dailyNutrients["energy-kcal"]),
        carbohydrates_value: calculateAdherence(totalIntake.carbohydrates_value, dailyNutrients.carbohydrates_value),
        proteins_value: calculateAdherence(totalIntake.proteins_value, dailyNutrients.proteins_value),
        fat_value: calculateAdherence(totalIntake.fat_value, dailyNutrients.fat_value),
      };

      const newScore = calculateScore(adherence)

      // If no log exists, create a new log
      const newDailyLog: DailyLog = {
        date: dateString,
        totalIntake,
        dailyNutrients,
        adherence,
        score: newScore,
        plan: currentPlanId
      };

      await setDoc(logsRef, newDailyLog);

      updateUserScore(newScore / 10)

      console.log(`Created new daily nutrition log for user: ${userId}`);
    }
  } catch (error) {
    console.error("Error updating or creating daily log in Firestore:", error);
  }
}

export default logMeal