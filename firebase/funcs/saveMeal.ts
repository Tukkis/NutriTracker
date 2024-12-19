import { doc, addDoc, collection } from "firebase/firestore"; 
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { MealItem } from "@/types/interfaces";
import formatMealDate from "../helpers/formatDate";

export default async function saveMeal(meal: MealItem[]) {
    try {
        const mealDate: string = formatMealDate(new Date());
        const userId : string | null = getCurrentUserId()
        const docRef = await addDoc(collection(db, "meals"), {
            userId: userId,
            meal: meal,
            date: mealDate
        });
        console.log("Document successfully written!", docRef.id);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}