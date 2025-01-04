import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserPlan, PlanContextType, PlanIntensity, ActivityLevel, Gender, PlanGoal } from "@/types/interfaces";
import { getUsersPlans } from "@/firebase/funcs/getUserPlans";

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>({
    id: "",
    userId: "",
    planData: {
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
  });
  const [plans, setPlans] = useState<UserPlan[]>([]);

  const fetchPlans = async () => {
    try {
      const fetchedPlans = await getUsersPlans();
      setPlans(fetchedPlans);
    } catch (error) {
      console.error("Error fetching user plans:", error);
    }
  };

  // Fetch all user plans
  useEffect(() => {
    fetchPlans();
  }, []);


  return (
    <PlanContext.Provider value={{ selectedPlan, setSelectedPlan, plans, setPlans }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlanContext = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlanContext must be used within a PlanProvider");
  }
  return context;
};