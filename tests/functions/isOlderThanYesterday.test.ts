import isOlderThanYesterday from "@/firebase/helpers/isOlderThanYesterday";

describe("isOlderThanYesterday", () => {
  it("should return true for a date older than yesterday", () => {
    const oldDate = "2024-12-31";  
    expect(isOlderThanYesterday(oldDate)).toBe(true);
  });

  it("should return false for today’s date", () => {
    const today = new Date().toISOString().split("T")[0]; 
    expect(isOlderThanYesterday(today)).toBe(false);
  });

  it("should return false for yesterday’s date", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];
    expect(isOlderThanYesterday(yesterdayDate)).toBe(false);
  });
});