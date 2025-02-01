import { calculateAdherence } from "@/firebase/helpers/caclulateAdherence";

describe("calculateAdherence", () => {
  it("should return 100 when both actual and goal are 0", () => {
    expect(calculateAdherence(0, 0)).toBe(100);
  });

  it("should return 0 when actual is 0 and goal is non-zero", () => {
    expect(calculateAdherence(0, 100)).toBe(0);
  });

  it("should return correct percentage", () => {
    expect(calculateAdherence(50, 100)).toBe(50);
    expect(calculateAdherence(75, 100)).toBe(75);
    expect(calculateAdherence(200, 100)).toBe(200);
  });
});