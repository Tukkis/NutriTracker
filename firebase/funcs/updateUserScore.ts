import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";

export async function updateUserScore(scoreChange: number) {
    try {
        // Get the current user's ID
        const userId: string | null = getCurrentUserId();
        if (!userId) {
            throw new Error("User not authenticated.");
        }

        const userDocRef = doc(db, `users/${userId}`);

        // Update the user's score by incrementing it
        await updateDoc(userDocRef, {
            score: increment(scoreChange) 
        });

        console.log("Document successfully updated!");
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}