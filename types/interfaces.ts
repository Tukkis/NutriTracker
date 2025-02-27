export type DataTab =
  | "plans"
  | "logs"
  | "meals"
  | "challenges";

export interface MealItem {
    product_name: string;
    "energy-kcal": number;
    carbohydrates_value: number;
    proteins_value: number;
    fat_value: number;
    amount: number;
}

export interface UserMeal {
    id: string;
    meals: MealItem[];
    userId: string;
    date: string;
}

export interface MealContextType {
    meal: MealItem[];
    setMeal: React.Dispatch<React.SetStateAction<MealItem[]>>;
    selectedMeal: UserMeal | null;
    setSelectedMeal: React.Dispatch<React.SetStateAction<UserMeal | null>>;
    mealItem: MealItem;
    setMealItem: React.Dispatch<React.SetStateAction<MealItem>>;
    addMealItem: (newMeal: MealItem) => void;
    removeMealItem: (mealIndex: number) => void;
    meals: UserMeal[]; 
    setMeals: React.Dispatch<React.SetStateAction<UserMeal[]>>;
    fetchMeals: () => void;
}

export interface PlanContextType {
    selectedPlan: UserPlan;
    setSelectedPlan: (plan: UserPlan) => void;
    addPlan: (plan: UserPlan) => void;
    editPlan: (plan: UserPlan) => void;
    plans: UserPlan[];
    setPlans: React.Dispatch<React.SetStateAction<UserPlan[]>>;
    currentPlanId: string | null;
}
  

export interface DailyLogContextType {
    dailyLogs: DailyLog[]; 
    setDailyLogs: React.Dispatch<React.SetStateAction<DailyLog[]>>;
    todaysLog: DailyLog;
    setTodaysLog: React.Dispatch<React.SetStateAction<DailyLog>>;
    userScore: number;
}
  
export interface ChallengeContextType {
    challenges: UserChallenge[];
    setChallenges: React.Dispatch<React.SetStateAction<UserChallenge[]>>;
    currentChallenge: UserChallenge | null; 
    setCurrentChallenge: React.Dispatch<React.SetStateAction<UserChallenge | null>>; 
    addChallenge: (challenge: UserChallenge) => void; 
    fetchChallenges: () => void;
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

export interface Nutrients {
    "energy-kcal": number;
    carbohydrates_value: number;
    proteins_value: number;
    fat_value: number;
}

export type PlanIntensity = "easy" | "moderate" | "hard";
export type PlanGoal = "fat_loss" | "muscle_gain" | "maintenance";
export type Gender = "male" | "female" | "other";
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "super_active";

export interface PlanData {
    name: string,
    intensity: PlanIntensity;
    startingWeight: number;
    height: number;
    age: number;
    gender: Gender; 
    activity: ActivityLevel; 
    goal: PlanGoal;
    dailyNutrients: Nutrients;
}

export interface UserPlan {
    id: string;
    userId: string;
    planData: PlanData;
}

export interface DailyLog {
    date: string;
    totalIntake: Nutrients;
    dailyNutrients: Nutrients;
    adherence: Nutrients;
    plan: string;
    score: number;
}

export interface ChallengeData {
    id: string;
    name: string;
    durationDays: number;
    goal: string;
    intensity: string;
    targetNutrients: Nutrients;
    description: string;
}

export interface UserChallenge {
    id?: string;
    challengeId: string;
    name: string;
    startDate: string;
    endDate: string;
    duration: number;
    dailyProgress: number;
    progress: number;
    lastTracked: string;
    completed: boolean;
    targetNutrients: Nutrients;
}