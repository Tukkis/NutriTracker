import { doc, addDoc, collection } from "firebase/firestore"; 
import { db } from "./firestore";
import { getCurrentUserId } from "./funcs/getCurrentUserId";
import { MealItem } from "@/types/interfaces";

// Add a new document in collection "cities"
export default async function saveMeal(meal: MealItem[]) {
    try {
        const userId : string | null = getCurrentUserId()
        const docRef = await addDoc(collection(db, "meals"), {
            userId: userId,
            meal: meal,
            date: new Date()
        });
        console.log("Document successfully written!", docRef.id);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}