export interface MealItem {
    name: string;
    carbs: number;
    protein: number;
    fats: number;
}

export interface MealContextType {
    meal: MealItem[];
    setMeal: React.Dispatch<React.SetStateAction<MealItem[]>>;
    mealItem: MealItem;
    setMealItem: React.Dispatch<React.SetStateAction<MealItem>>;
    addMeal: (newMeal: MealItem) => void;
  }