import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserPlan, PlanContextType, PlanIntensity, ActivityLevel, Gender, PlanGoal } from "@/types/interfaces";
import { getUsersPlans } from "@/firebase/funcs/plan/getUserPlans";
import { getCurrentPlanId } from "@/firebase/funcs/plan/getCurrentPlanId";

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
  const [currentPlanId, setCurrentPlanID] = useState<string | null>(null)

  const fetchPlans = async () => {
    try {
        const fetchedPlans = await getUsersPlans();
        const currentPlan = await getCurrentPlanId();

        // Move the current plan to the top
        const currentPlanData = fetchedPlans.find(plan => plan.id === currentPlan);
        const otherPlans = fetchedPlans.filter(plan => plan.id !== currentPlan);

        if (currentPlanData) {
            setPlans([currentPlanData, ...otherPlans]);
        } else {
            setPlans(fetchedPlans); 
        }

        setCurrentPlanID(currentPlan);
    } catch (error) {
        console.error("Error fetching user plans:", error);
    }
  };

  const addPlan = (newPlan: UserPlan) => {
    setPlans((prevPlans) => [newPlan, ...prevPlans]);
    setCurrentPlanID(newPlan.id)
  };

  const editPlan = (updatedPlan: UserPlan) => {
    setPlans((prevPlans) =>
        prevPlans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
    );

    if (updatedPlan.id === currentPlanId) {
      setSelectedPlan({
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
      })
    } 
    setCurrentPlanID(updatedPlan.id)
  };

  // Fetch all user plans
  useEffect(() => {
    fetchPlans();
  }, []);


  return (
    <PlanContext.Provider value={{ selectedPlan, setSelectedPlan, addPlan, editPlan, plans, setPlans, currentPlanId }}>
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