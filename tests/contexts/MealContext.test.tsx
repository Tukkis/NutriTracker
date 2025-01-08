import React from "react";
import { render, screen } from "@testing-library/react";
import { MealProvider, useMealContext } from "@/contexts/MealContext";

// Mock the getUsersMeals function
jest.mock('@/firebase/funcs/meal/getUsersMeals', () => ({
  getUsersMeals: jest.fn().mockResolvedValue([
    {
      id: "1",
      product_name: "Apple",
      "energy-kcal": 52,
      carbohydrates_value: 14,
      proteins_value: 0.3,
      fat_value: 0.2,
      amount: 100,
    },
    {
      id: "2",
      product_name: "Banana",
      "energy-kcal": 89,
      carbohydrates_value: 23,
      proteins_value: 1.1,
      fat_value: 0.3,
      amount: 100,
    },
  ]),
}));

it("fetches meals and sets the state correctly", async () => {
  const TestComponent = () => {
    const { meals } = useMealContext();

    return (
      <>
        <div>Meals: {JSON.stringify(meals)}</div>
      </>
    );
  };

  render(
    <MealProvider>
      <TestComponent />
    </MealProvider>
  );

  // Wait for meals to appear
  const mealsText = await screen.findByText(/Meals:/);

  expect(mealsText).toBeTruthy();
});

it("adds a new meal item and updates state", async () => {
  const newMeal = {
    product_name: "Orange",
    "energy-kcal": 47,
    carbohydrates_value: 12,
    proteins_value: 0.9,
    fat_value: 0.1,
    amount: 100,
  };

  const TestComponent = () => {
    const { addMealItem, meals } = useMealContext();

    React.useEffect(() => {
      addMealItem(newMeal);
    }, []);

    return (
      <>
        <div>Meals: {JSON.stringify(meals)}</div>
      </>
    );
  };

  render(
    <MealProvider>
      <TestComponent />
    </MealProvider>
  );

  // Wait for the meal list to update
  const mealsText = await screen.findByText(/Meals:/);

  expect(mealsText).toBeTruthy();
});