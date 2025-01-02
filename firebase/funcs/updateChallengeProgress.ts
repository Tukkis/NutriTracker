import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firestore";
import { UserChallenge, Nutrients, DailyLog } from "@/types/interfaces";
import formatDate from "../helpers/formatDate";
import { getCurrentChallengeId } from "./getCurrentChallengeId";
import isOlderThanYesterday from "../helpers/isOlderThanYesterday";
import { getCurrentUserId } from "./getCurrentUserId";


export async function updateChallengeProgress(daysLog?:DailyLog): Promise<void> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
        console.error("No user");
        return;
    }
    const challengeId = await getCurrentChallengeId(userId)
    
    // Reference to the user's challenge document
    const userChallengeRef = doc(db, `users/${userId}/challenges`, challengeId);

    // Fetch the current challenge data
    const userChallengeSnapshot = await getDoc(userChallengeRef);
    const userChallengeData = userChallengeSnapshot.data() as UserChallenge;

    if (!userChallengeData) {
      console.error("Challenge not found!");
      return;
    }

    let updatedDailyProgress = userChallengeData.dailyProgress;
    let updatedProgress = userChallengeData.progress;
    let updatedCompleted = userChallengeData.completed;
    let updatedLastTracked = userChallengeData.lastTracked;

    const today = new Date();
  
    const formattedToday = formatDate(today);

    const indexOfMeal = userChallengeData.name.indexOf("meal")

    if(indexOfMeal){
        if(updatedLastTracked === formattedToday){
            return
        }
        if (userChallengeData.dailyProgress < Number(userChallengeData.name.charAt(indexOfMeal - 2))) {
            updatedDailyProgress += 1; 
        } else {
            updatedDailyProgress = 0;
            updatedProgress += 1;
            updatedLastTracked = formattedToday
        }
    } else if (daysLog){
        const nutrientKeys: (keyof Nutrients)[] = ["carbohydrates_value", "energy-kcal", "fat_value", "proteins_value"];
    
        let success: boolean = false;

        nutrientKeys.forEach(key => {
            const targetValue = userChallengeData.targetNutrients[key];
            const goalValue = daysLog.dailyNutrients[key];
            const intakeValue = daysLog.totalIntake[key];

            if (targetValue < 50) {
              if (intakeValue <= goalValue) {
                success = true;
              }
            } 
            
            else if (targetValue === 100) {
              if (intakeValue >= goalValue) {
                success = true;
              }
            } 
            else {
              const minRange = 100 - targetValue / 2;
              const maxRange = 100 + targetValue / 2; 
              if (intakeValue >= minRange && intakeValue <= maxRange) {
                success = true;
              }
            }
        });

        if (success){
        updatedProgress += 1;
        }
        updatedLastTracked = formattedToday;
    }

    if(isOlderThanYesterday(formattedToday)){
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1);
        const formattedYesterday = formatDate(yesterday);
        updatedLastTracked = formattedYesterday;
    }
    
 
    // Update the user challenge document with the new progress
    await updateDoc(userChallengeRef, {
      dailyProgress: updatedDailyProgress,
      progress: updatedProgress,
      completed: updatedCompleted,
      lastTracked: updatedLastTracked,
    });

    console.log("User challenge updated successfully!");
  } catch (error) {
    console.error("Error updating challenge progress:", error);
  }
}