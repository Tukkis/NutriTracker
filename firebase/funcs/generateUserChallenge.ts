import { doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../firestore";
import { getChallenges } from "./getChallenges";
import { UserPlan, UserChallenge } from "@/types/interfaces";
import formatDate from "../helpers/formatDate";

export async function generateUserChallenge(plan: UserPlan) {
    try {
        const userId = plan.userId

        const challenges = await getChallenges(plan.planData.intensity, plan.planData.goal);

        const userChallengesRef = collection(db, `users/${userId}/challenges`);
        
        const item = challenges[Math.floor(Math.random()*challenges.length)];

        console.log(item)

        const newUserChallenge: UserChallenge = {
            challengeId: item.id,
            name:item.name,
            startDate: formatDate(new Date),
            duration: item.durationDays,
            dailyProgress: 0,
            progress: 0,
            lastTracked: "",
            completed: false,
            targetNutrients: item.targetNutrients
        }
        
        const docRef = await addDoc(userChallengesRef, newUserChallenge);

        console.log("Document successfully written!", docRef.id)


         const userDocRef = doc(db, `users/${userId}`);

        // Update the user's document to set the currentChallenge field
        await updateDoc(userDocRef, {
            currentChallenge: docRef.id,  // Set the current challenge to the newly created challenge's ID
        });

        console.log("User's current challenge updated!");

        return docRef

    } catch (error) {
        console.error("Error writing document: ", error);
        return null
    }
}