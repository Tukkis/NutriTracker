import { doc, addDoc, collection } from "firebase/firestore"; 
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { Nutrients } from "@/types/interfaces";
import formatMealDate from "../helpers/formatDate";



// Add a new document in collection "cities"
export default async function savePlan(nutrients: Nutrients) {
    try {
        const mealDate: string = formatMealDate(new Date());
        const userId : string | null = getCurrentUserId()
        const docRef = await addDoc(collection(db, "plans"), {
            userId: userId,
            nutrients: nutrients,
            startDate: mealDate
        });
        console.log("Document successfully written!", docRef.id);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}