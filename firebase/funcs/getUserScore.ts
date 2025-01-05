import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";

export async function getUserScore(): Promise<string | undefined> {
    try {
        // Get the current user's ID
        const userId: string | null = getCurrentUserId();
        if (!userId) {
            throw new Error("User not authenticated.");
        }

        const userDocRef = doc(db, `users/${userId}`);

        // Get the current user's score
        const userDocSnapshot = await getDoc(userDocRef);
        if (!userDocSnapshot.exists()) {
            throw new Error("User document does not exist.");
        }

        console.log("Score successfully fetched!");
        return userDocSnapshot.data()?.score

    } catch (error) {
        console.error("Error updating document: ", error);
    }
}