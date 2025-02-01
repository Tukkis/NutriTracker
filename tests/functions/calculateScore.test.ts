import { calculateScore } from "@/firebase/helpers/calculateScore";
import { Nutrients } from "@/types/interfaces";

describe("calculateScore", () => {
  it("should return 0 when the adherence values are too low", () => {
    const adherence: Nutrients = {
      "energy-kcal": 20,
      carbohydrates_value: 20,
      proteins_value: 20,
      fat_value: 20,
    };
    expect(calculateScore(adherence)).toBe(0);
  });

  it("should return 100 when the adherence values are within the optimal range", () => {
    const adherence: Nutrients = {
      "energy-kcal": 100,
      carbohydrates_value: 100,
      proteins_value: 100,
      fat_value: 100,
    };
    expect(calculateScore(adherence)).toBe(100);
  });

  it("should return a score between 0 and 100 for valid adherence values", () => {
    const adherence: Nutrients = {
      "energy-kcal": 130,
      carbohydrates_value: 130,
      proteins_value: 130,
      fat_value: 130,
    };
    const score = calculateScore(adherence);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });
});