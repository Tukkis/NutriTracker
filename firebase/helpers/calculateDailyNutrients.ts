import { ActivityLevel, PlanData, Nutrients } from "@/types/interfaces";

function calculateDailyNutrients(plan: PlanData): Nutrients {
    const { gender, age, height, startingWeight, activity, intensity, goal } = plan;

    let intensityModifier : number;
    if (intensity === "hard" && goal === "fat_loss") {
        intensityModifier = 0.85
    } else if (intensity === "moderate" && goal === "fat_loss"){
        intensityModifier = 0.92
    }else if(intensity === "hard" && goal === "muscle_gain"){
        intensityModifier = 1.15
    } else if(intensity === "moderate" && goal === "muscle_gain"){
        intensityModifier = 1.07
    } else {
        intensityModifier = 1
    }


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
        carbohydratesPercentage = 40; // Lower carbs
        proteinsPercentage = 30;      // Higher protein
        fatPercentage = 30;           // Moderate fats
    } else if (goal === "muscle_gain") {
        carbohydratesPercentage = 46; // Higher carbs
        proteinsPercentage = 26;      // Higher protein
        fatPercentage = 28;           // Lower fats
    } else { // Maintenance
        carbohydratesPercentage = 45; // Balanced
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