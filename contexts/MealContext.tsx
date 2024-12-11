import React, { createContext, useContext, useState, ReactNode } from "react";
import { MealItem, MealContextType } from "../types/interfaces";

const defaultMealItem: MealItem = {
  product_name: "",
  "energy-kcal": 0,
  carbohydrates_value: 0,
  proteins_value: 0,
  fat_value: 0,
  amount: 0
};

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider = ({ children }: { children: ReactNode }) => {
  const [meal, setMeal] = useState<MealItem[]>([]);
  const [mealItem, setMealItem] = useState<MealItem>(defaultMealItem);

  const addMeal = (newMeal: MealItem) => {
    setMeal((prevMeals) => [...prevMeals, newMeal]);
  };

  return (
    <MealContext.Provider value={{ meal, setMeal, mealItem, setMealItem, addMeal }}>
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