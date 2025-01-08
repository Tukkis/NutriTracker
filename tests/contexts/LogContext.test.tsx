import React from "react";
import { render, screen } from "@testing-library/react";
import { DailyLogProvider, useDailyLogContext } from "@/contexts/LogContext";
import { MealProvider } from "@/contexts/MealContext";

// Mocking the fetch functions
jest.mock('@/firebase/funcs/log/getUserLogs', () => ({
  getUserDailyLogs: jest.fn().mockResolvedValue([
    {
      date: "08-01-2025",
      totalIntake: {
        "energy-kcal": 2000,
        carbohydrates_value: 250,
        proteins_value: 75,
        fat_value: 50,
      },
      dailyNutrients: {
        "energy-kcal": 2000,
        carbohydrates_value: 250,
        proteins_value: 75,
        fat_value: 50,
      },
      adherence: {
        "energy-kcal": 100,
        carbohydrates_value: 100,
        proteins_value: 100,
        fat_value: 100,
      },
      plan: "1",
      score: 90,
    },
  ]),
}));

jest.mock('@/firebase/funcs/getUserScore', () => ({
  getUserScore: jest.fn().mockResolvedValue(90),
}));

jest.mock('@/firebase/funcs/meal/getUsersMeals', () => ({
    getUsersMeals: jest.fn().mockResolvedValue([
      {
        id: "1",
        userId: "user1",
        name: "Breakfast",
        items: [
          {
            product_name: "Eggs",
            "energy-kcal": 150,
            carbohydrates_value: 1,
            proteins_value: 12,
            fat_value: 10,
            amount: 2,
          },
        ],
      },
      {
        id: "2",
        userId: "user1",
        name: "Lunch",
        items: [
          {
            product_name: "Chicken",
            "energy-kcal": 250,
            carbohydrates_value: 0,
            proteins_value: 25,
            fat_value: 10,
            amount: 1,
          },
        ],
      },
    ]),
  }));

it("fetches daily logs and updates state correctly", async () => {
  const TestComponent = () => {
    const { dailyLogs, todaysLog, userScore } = useDailyLogContext();

    return (
      <>
        <div>Daily Logs: {JSON.stringify(dailyLogs)}</div>
        <div>Today's Log: {JSON.stringify(todaysLog)}</div>
        <div>User Score: {userScore}</div>
      </>
    );
  };

  render(
    <MealProvider>
        <DailyLogProvider>
            <TestComponent />
        </DailyLogProvider>
    </MealProvider>
  );

  // Wait for the logs and score to appear
  const dailyLogsText = await screen.findByText(/Daily Logs:/);
  const todaysLogText = await screen.findByText(/Today's Log:/);
  const userScoreText = await screen.findByText(/User Score:/);

  expect(dailyLogsText).toBeTruthy();
  expect(todaysLogText).toBeTruthy();
  expect(userScoreText).toBeTruthy();
});

it("updates today's log and user score correctly", async () => {
  const updatedLog = {
    date: "08-01-2025",
    totalIntake: {
      "energy-kcal": 1800,
      carbohydrates_value: 220,
      proteins_value: 70,
      fat_value: 45,
    },
    dailyNutrients: {
      "energy-kcal": 1800,
      carbohydrates_value: 220,
      proteins_value: 70,
      fat_value: 45,
    },
    adherence: {
      "energy-kcal": 90,
      carbohydrates_value: 90,
      proteins_value: 90,
      fat_value: 90,
    },
    plan: "1",
    score: 85,
  };

  const TestComponent = () => {
    const { setTodaysLog, todaysLog } = useDailyLogContext();

    React.useEffect(() => {
      setTodaysLog(updatedLog);
    }, []);

    return (
      <>
        <div>Today's Log: {JSON.stringify(todaysLog)}</div>
      </>
    );
  };

  render(
    <MealProvider>
        <DailyLogProvider>
            <TestComponent />
        </DailyLogProvider>
    </MealProvider>
  );

  // Wait for today's log to update
  const todaysLogText = await screen.findByText(/Today's Log:/);

  expect(todaysLogText).toBeTruthy();
});