import { Nutrients } from "@/types/interfaces";

export function calculateScore(adherence: Nutrients): number {

  const weights = {
    "energy-kcal": 0.34,
    carbohydrates_value: 0.22, 
    proteins_value: 0.22, 
    fat_value: 0.22, 
  };

  const score =
  adherence["energy-kcal"] * weights["energy-kcal"] +
  adherence.carbohydrates_value * weights.carbohydrates_value +
  adherence.proteins_value * weights.proteins_value +
  adherence.fat_value * weights.fat_value;

  return Math.round(Math.max(0, Math.min(100, score)));
}