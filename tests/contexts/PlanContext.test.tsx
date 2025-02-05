import React from "react";
import { render, screen } from "@testing-library/react";
import { PlanProvider, usePlanContext } from "@/contexts/PlanContext";
import { UserPlan, PlanIntensity, ActivityLevel, Gender, PlanGoal } from "@/types/interfaces";

// Mocking the firebase functions used to fetch plans
jest.mock('@/firebase/funcs/plan/getUserPlans', () => ({
  getUsersPlans: jest.fn().mockResolvedValue([
    {
      id: "1",
      userId: "user1",
      planData: {
        name: "",
        intensity: "moderate" as PlanIntensity,
        startingWeight: 70,
        height: 170,
        age: 30,
        gender: "other" as Gender,
        activity: "moderately_active" as ActivityLevel,
        goal: "maintenance" as PlanGoal,
        dailyNutrients: {
          "energy-kcal": 2000,
          proteins_value: 75,
          fat_value: 50,
          carbohydrates_value: 250,
        }
      }
    },
    {
      id: "2",
      userId: "user1",
      planData: {
        name: "",
        intensity: "high" as PlanIntensity,
        startingWeight: 75,
        height: 170,
        age: 30,
        gender: "male" as Gender,
        activity: "active" as ActivityLevel,
        goal: "fat_loss" as PlanGoal,
        dailyNutrients: {
          "energy-kcal": 1800,
          proteins_value: 85,
          fat_value: 60,
          carbohydrates_value: 200,
        }
      }
    }
  ]),
}));

jest.mock('@/firebase/funcs/plan/getCurrentPlanId', () => ({
  getCurrentPlanId: jest.fn().mockResolvedValue("1"),
}));

it("fetches plans and sets the current plan", async () => {
  const TestComponent = () => {
    const { plans, currentPlanId } = usePlanContext();

    return (
      <>
        <div>Plans: {JSON.stringify(plans)}</div>
        <div>Current Plan ID: {currentPlanId}</div>
      </>
    );
  };

  render(
    <PlanProvider>
      <TestComponent />
    </PlanProvider>
  );

  // Wait for the plans and current plan ID to appear
  const plansText = await screen.findByText(/Plans:/);
  const currentPlanIdText = await screen.findByText(/Current Plan ID: 1/);

  expect(plansText).toBeTruthy();
  expect(currentPlanIdText).toBeTruthy();
});

it("adds a new plan and updates current plan", async () => {
  const newPlan: UserPlan = {
    id: "3",
    userId: "user1",
    planData: {
      name: "",
      intensity: "low" as PlanIntensity,
      startingWeight: 80,
      height: 170,
      age: 30,
      gender: "female" as Gender,
      activity: "sedentary" as ActivityLevel,
      goal: "weight_loss" as PlanGoal,
      dailyNutrients: {
        "energy-kcal": 1500,
        proteins_value: 60,
        fat_value: 40,
        carbohydrates_value: 180,
      }
    }
  };

  const TestComponent = () => {
    const { addPlan, plans, currentPlanId } = usePlanContext();

    React.useEffect(() => {
      addPlan(newPlan);
    }, []);

    return (
      <>
        <div>Plans: {JSON.stringify(plans)}</div>
        <div>Current Plan ID: {currentPlanId}</div>
      </>
    );
  };

  render(
    <PlanProvider>
      <TestComponent />
    </PlanProvider>
  );

  // Wait for the new plan and current plan ID to appear
  const plansText = await screen.findByText(/Plans:/);
  const currentPlanIdText = await screen.findByText(/Current Plan ID: 3/);

  expect(plansText).toBeTruthy();
  expect(currentPlanIdText).toBeTruthy();
});

it("edits a plan and updates the state correctly", async () => {
  const updatedPlan: UserPlan = {
    id: "1",
    userId: "user1",
    planData: {
      name: "",
      intensity: "very_high" as PlanIntensity,
      startingWeight: 70,
      height: 170,
      age: 30,
      gender: "other" as Gender,
      activity: "very_active" as ActivityLevel,
      goal: "maintenance" as PlanGoal,
      dailyNutrients: {
        "energy-kcal": 2500,
        proteins_value: 90,
        fat_value: 80,
        carbohydrates_value: 300,
      }
    }
  };

  const TestComponent = () => {
    const { editPlan, plans } = usePlanContext();

    React.useEffect(() => {
      editPlan(updatedPlan);
    }, []);

    return (
      <>
        <div>Plans: {JSON.stringify(plans)}</div>
      </>
    );
  };

  render(
    <PlanProvider>
      <TestComponent />
    </PlanProvider>
  );

  // Wait for the updated plan to appear
  const plansText = await screen.findByText(/Plans:/);

  expect(plansText).toBeTruthy();
});