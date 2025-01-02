import { collection, where, query,getDocs } from "firebase/firestore";
import { db } from "../firestore";
import { ChallengeData } from "@/types/interfaces";

export async function getChallenges(intensity: string, goal: string) {

    const challengesRef = collection(db,"challenges");

    const goalQuery = query(
        challengesRef,
        where("goal", "==", goal),
        where("intensity", "==", intensity)
    );
    
    const allGoalQuery = query(
        challengesRef,
        where("goal", "==", "all"),
        where("intensity", "==", intensity) 
    );

    try {
        const goalSnapshot = await getDocs(goalQuery);
        const allGoalSnapshot = await getDocs(allGoalQuery);
    
        const challenges: ChallengeData[] = [
            ...goalSnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name, 
                durationDays: data.durationDays, 
                goal: data.goal, 
                intensity: data.intensity, 
                targetNutrients: data.targetNutrients, 
                description: data.description, 
                rewardPoints: data.rewardPoints, 
              };
            }),
            ...allGoalSnapshot.docs.map((doc) => {
              const data = doc.data(); 
              return {
                id: doc.id,
                name: data.name,
                durationDays: data.durationDays,
                goal: data.goal,
                intensity: data.intensity,
                targetNutrients: data.targetNutrients,
                description: data.description,
                rewardPoints: data.rewardPoints,
            };
            }),
        ];
    
        console.log("Challenges found:", challenges);
        return challenges;
    } catch (error) {
        console.error("Error fetching challenges:", error);
        return [];
    }
  }