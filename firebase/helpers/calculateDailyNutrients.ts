import { ActivityLevel, PlanData, Nutrients } from "@/types/interfaces";

function calculateDailyNutrients(plan: PlanData): Nutrients {
    const { gender, age, height, startingWeight, activity, intensity, goal } = plan;

    const intensityModifiers: { [key: string]: number } = {
        "hard_fat_loss": 0.85,
        "moderate_fat_loss": 0.90,
        "easy_fat_loss": 0.95,
        "hard_muscle_gain": 1.15,
        "moderate_muscle_gain": 1.10,
        "easy_muscle_gain": 1.05,
        "default": 1, // for any case not matched
    };

    const key = `${intensity}_${goal}`;  // Create a key based on intensity and goal
    const intensityModifier = intensityModifiers[key] || intensityModifiers["default"];

    // Calculate BMR (Basal Metabolic Rate)
    let bmr: number;
    if (gender === "male") {
        bmr = 10 * startingWeight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
        bmr = 10 * startingWeight + 6.25 * height - 5 * age - 161;
    } else {
        bmr = (10 * startingWeight + 6.25 * height - 5 * age + 5 - 161) / 2; // Average for "other"
    }

    // Adjust BMR based on activity level
    const activityMultiplier: { [key in ActivityLevel]: number } = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        super_active: 1.9,
    };
    const adjustedCalories = bmr * activityMultiplier[activity];

    // Final adjusted calories
    const finalCalories = adjustedCalories * intensityModifier;

    // Macronutrient distribution
    let carbohydratesPercentage: number;
    let proteinsPercentage: number;
    let fatPercentage: number;

    if (goal === "fat_loss") {
        carbohydratesPercentage = 40; 
        proteinsPercentage = 30;      
        fatPercentage = 30;           
    } else if (goal === "muscle_gain") {
        carbohydratesPercentage = 46; 
        proteinsPercentage = 26;      
        fatPercentage = 28;           
    } else { 
        carbohydratesPercentage = 45; 
        proteinsPercentage = 30;
        fatPercentage = 25;
    }

    // Convert percentages to gram values (calories per gram: 4 for carbs/proteins, 9 for fats)
    const carbohydrates = (finalCalories * (carbohydratesPercentage / 100)) / 4;
    const proteins = (finalCalories * (proteinsPercentage / 100)) / 4;
    const fats = (finalCalories * (fatPercentage / 100)) / 9;

    return {
        "energy-kcal": Math.round(finalCalories),
        carbohydrates_value: Math.round(carbohydrates),
        proteins_value: Math.round(proteins),
        fat_value: Math.round(fats),
    };
}

export default calculateDailyNutrients;