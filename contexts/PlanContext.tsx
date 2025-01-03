import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserPlan } from "@/types/interfaces";

interface PlanContextProps {
  selectedPlan: UserPlan | null;
  setSelectedPlan: (plan: UserPlan | null) => void;
}

const PlanContext = createContext<PlanContextProps | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPlan, setSelectedPlan] = useState<UserPlan | null>(null);
  return (
    <PlanContext.Provider value={{ selectedPlan, setSelectedPlan }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlanContext must be used within a PlanProvider");
  }
  return context;
};