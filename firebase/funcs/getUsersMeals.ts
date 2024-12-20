import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firestore";
import { getCurrentUserId } from "./getCurrentUserId";
import { UserMeal, MealItem } from "@/types/interfaces";
import formatMealDate from "../helpers/formatDate";

export async function getUsersMeals(date?: Date) {
  try {
    const usersId: string | null = getCurrentUserId();
    if (!usersId) {
      console.error("No user ID found.");
      return [];
    }

    const mealsCollectionRef = collection(db, `users/${usersId}/meals`);

    let mealQuery;

    if (date) {
      const formattedDate = formatMealDate(date); // Ensure the date format matches Firestore documents
      mealQuery = query(mealsCollectionRef, where("date", "==", formattedDate));
    } else {
      mealQuery = mealsCollectionRef;
    }

    const querySnapshot = await getDocs(mealQuery);

    const meals: UserMeal[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        meals: data.meal as MealItem[],
        date: data.date,
        userId: usersId,
      };
    });

    return meals;
  } catch (error) {
    console.error("Error fetching user meals:", error);
    return [];
  }
}