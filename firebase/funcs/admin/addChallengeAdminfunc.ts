import { db } from "../../firestore";
import { collection, addDoc } from "firebase/firestore";

export async function addChallengeWithNutrients() {
  
    try {
    const challengesRef = collection(db, "challenges");

    const newChallenge = {
        name: "Log atleast 3 meals for 14 Days",
        description: "Minimum 3 meals logged per day",
        goal: "all",
        intensity: "hard",
        durationDays: 14,
        rewardPoints: 200,
        targetNutrients: {
        "energy-kcal": 0,
        carbohydrates_value: 0,
        proteins_value: 0,
        fat_value: 0,
        },
    };

    const challengeRef = await addDoc(challengesRef,newChallenge);
    console.log("Document successfully written!", challengeRef.id);    
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}