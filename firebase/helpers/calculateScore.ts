import { Nutrients } from "@/types/interfaces";

export function calculateScore(adherence: Nutrients): number {
  const weights = {
    "energy-kcal": 0.34,
    carbohydrates_value: 0.22,
    proteins_value: 0.22,
    fat_value: 0.22,
  };

  function scaleScore(adherenceValue: number): number {
    if (adherenceValue < 25) return 0;
    if (adherenceValue > 175) return 0;

    if (adherenceValue >= 80 && adherenceValue <= 120) {
      return 100; // Full score in the target range
    }

    if (adherenceValue < 80) {
      // Scale linearly between 0 (at 25) and 100 (at 80)
      return ((adherenceValue - 25) / (80 - 25)) * 100;
    }

    if (adherenceValue > 120) {
      // Scale linearly between 100 (at 120) and 0 (at 175)
      return ((175 - adherenceValue) / (175 - 120)) * 100;
    }

    return 0; 
  }

  const score =
    scaleScore(adherence["energy-kcal"]) * weights["energy-kcal"] +
    scaleScore(adherence.carbohydrates_value) * weights.carbohydrates_value +
    scaleScore(adherence.proteins_value) * weights.proteins_value +
    scaleScore(adherence.fat_value) * weights.fat_value;

  return Math.round(Math.max(0, Math.min(100, score)));
}