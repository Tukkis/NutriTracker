import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MealItem, MealContextType, UserMeal } from "../types/interfaces";
import { getUsersMeals } from "@/firebase/funcs/meal/getUsersMeals";

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider = ({ children }: { children: ReactNode }) => {
  const [meals, setMeals] = useState<UserMeal[]>([]);
  const [selectedMeal, setSelectedMeal]= useState<UserMeal | null>(null)
  const [meal, setMeal] = useState<MealItem[]>([]);
  const [mealItem, setMealItem] = useState<MealItem>({
    product_name: "",
    "energy-kcal": 0,
    carbohydrates_value: 0,
    proteins_value: 0,
    fat_value: 0,
    amount: 0
  });

  const addMealItem = (newMeal: MealItem) => {
    setMeal((prevMeals) => [...prevMeals, newMeal]);
  };
  
  const removeMealItem = (mealIndex: number) => {
    setMeal((prevMeals) => prevMeals.filter((_, index) => index !== mealIndex));
  };

  const fetchMeals = async () => {
      try {
        const fetchedPlans = await getUsersMeals();
        setMeals(fetchedPlans);
      } catch (error) {
        console.error("Error fetching user plans:", error);
      }
    };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <MealContext.Provider value={{ meal, setMeal, fetchMeals, selectedMeal, setSelectedMeal, mealItem, setMealItem, addMealItem, removeMealItem, meals, setMeals }}>
      {children}
    </MealContext.Provider>
  );
};

export const useMealContext = (): MealContextType => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMealContext must be used within a MealProvider");
  }
  return context;
};