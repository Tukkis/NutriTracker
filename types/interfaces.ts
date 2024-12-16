export interface MealItem {
    product_name: string;
    "energy-kcal"?: number;
    carbohydrates_value: number;
    proteins_value: number;
    fat_value: number;
    amount: number;
}

export interface UserMeal {
    id: string;
    meals: MealItem[];
    userId: string;
    date: Date;
}

export interface MealContextType {
    meal: MealItem[];
    setMeal: React.Dispatch<React.SetStateAction<MealItem[]>>;
    mealItem: MealItem;
    setMealItem: React.Dispatch<React.SetStateAction<MealItem>>;
    addMeal: (newMeal: MealItem) => void;
}
  
interface Product {
    product_name?: string;
    nutriments?: MealItem;
    ingredients_text?: string;
    brands?: string;
    [key: string]: any; 
}
  
export interface ApiResponse {
    code: string;
    status: number;
    product?: Product; 
}