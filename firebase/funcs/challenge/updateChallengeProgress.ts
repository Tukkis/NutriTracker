import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firestore";
import { UserChallenge, Nutrients, DailyLog } from "@/types/interfaces";
import formatDate from "../../helpers/formatDate";
import { getCurrentChallengeId } from "./getCurrentChallengeId";
import isOlderThanYesterday from "../../helpers/isOlderThanYesterday";
import { getCurrentUserId } from "../getCurrentUserId";
import { updateUserScore } from "../updateUserScore";


const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number); 
  return new Date(year, month - 1, day); 
}

export async function updateChallengeProgress(daysLog?:DailyLog): Promise<void> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
        console.error("No user");
        return;
    }
    const challengeId = await getCurrentChallengeId()

    // Reference to the user's challenge document
    const userChallengeRef = doc(db, `users/${userId}/challenges`, challengeId);

    // Fetch the current challenge data
    const userChallengeSnapshot = await getDoc(userChallengeRef);
    const userChallengeData = userChallengeSnapshot.data() as UserChallenge;

    if (!userChallengeData) {
      console.error("Challenge not found!");
      return;
    }

    console.log(userChallengeData)

    let updatedDailyProgress = userChallengeData.dailyProgress;
    let updatedProgress = userChallengeData.progress;
    let updatedCompleted = userChallengeData.completed;
    let updatedLastTracked = userChallengeData.lastTracked;

    const today = new Date();
  
    const formattedToday = formatDate(today);

    const indexOfMeal = userChallengeData.name.indexOf("meal")

    if(updatedLastTracked === formattedToday || updatedCompleted){
      console.log("No update")
      return;
    }
    
    if(today > parseDate(userChallengeData.endDate)){
      updatedCompleted = true
      updateUserScore(updatedProgress * 10)
    } else if(!daysLog && indexOfMeal !== -1){
      if (userChallengeData.dailyProgress < Number(userChallengeData.name.charAt(indexOfMeal - 2))) {
        updatedDailyProgress += 1; 
      } else {
        updatedDailyProgress = 0;
        updatedProgress += 1;
        updatedLastTracked = formattedToday
      }
    } else if (daysLog){
      const nutrientKeys: (keyof Nutrients)[] = ["carbohydrates_value", "energy-kcal", "fat_value", "proteins_value"];
  
      let didFailToMeetTarget : boolean = false;

      nutrientKeys.forEach(key => {
        const targetValue = userChallengeData.targetNutrients[key];
        const goalValue = daysLog.dailyNutrients[key];
        const intakeValue = daysLog.totalIntake[key];

        // User needs to be below or equal to the goal
        if (targetValue < -50) {
          if (intakeValue >= goalValue) {
            didFailToMeetTarget = true;
          }
        } 
        // User needs to exceed or equal goal
        else if (targetValue > 50) {
          if (intakeValue <= goalValue) {
            didFailToMeetTarget = true;
          }
        } 
        // User needs to be between /2 of the challenges targetValue tolerance from goal
        else {
          const minRange = goalValue * (1 - targetValue / 2);
          const maxRange = goalValue * (1 + targetValue / 2); 
          if (intakeValue <= minRange && intakeValue >= maxRange) {
            didFailToMeetTarget = true;
          }
        }
      });

      if (!didFailToMeetTarget){
      updatedProgress += 1;
      }
      updatedLastTracked = formattedToday;

      console.log(updatedLastTracked)
    }

    if(isOlderThanYesterday(updatedLastTracked)){
      console.log("last updated is older than yesterday")
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