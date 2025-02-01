import formatDate from "@/firebase/helpers/formatDate";
describe("formatDate", () => {
  it("should return the date in the correct format", () => {
    const date = new Date(2025, 0, 1); 
    expect(formatDate(date)).toBe("01/01/2025");
  });

  it("should handle single-digit days and months correctly", () => {
    const date = new Date(2025, 8, 5); 
    expect(formatDate(date)).toBe("05/09/2025");
  });
});