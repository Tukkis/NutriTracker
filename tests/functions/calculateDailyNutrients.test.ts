import calculateDailyNutrients from "@/firebase/helpers/calculateDailyNutrients";
import { PlanData } from "@/types/interfaces";

describe("calculateDailyNutrients", () => {
  it("should return the correct nutrient distribution for fat loss", () => {
    const plan: PlanData = {
      name: "plan",
      gender: "male",
      age: 25,
      height: 175,
      startingWeight: 70,
      activity: "moderately_active",
      intensity: "moderate",
      goal: "fat_loss",
      dailyNutrients: { 
        "energy-kcal": 0,
        carbohydrates_value: 0,
        proteins_value: 0,
        fat_value: 0,
      },
    };
    
    const result = calculateDailyNutrients(plan);
    expect(result).toHaveProperty("energy-kcal");
    expect(result).toHaveProperty("carbohydrates_value");
    expect(result).toHaveProperty("proteins_value");
    expect(result).toHaveProperty("fat_value");
  });

  it("should calculate correct values for muscle gain", () => {
    const plan: PlanData = {
      gender: "female",
      age: 30,
      height: 160,
      startingWeight: 60,
      activity: "lightly_active",
      intensity: "moderate",
      goal: "muscle_gain",
      dailyNutrients: {  
        "energy-kcal": 0, 
        carbohydrates_value: 0,
        proteins_value: 0,
        fat_value: 0,
      },
    };

    const result = calculateDailyNutrients(plan);
    expect(result["energy-kcal"]).toBeCloseTo(1950, 0); // Allowing for rounding precision
    expect(result["carbohydrates_value"]).toBeCloseTo(224, 0); 
    expect(result["proteins_value"]).toBeCloseTo(127, 0);
    expect(result["fat_value"]).toBeCloseTo(61, 0);
  });
});