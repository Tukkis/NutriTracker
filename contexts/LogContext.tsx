import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Nutrients, DailyLog } from "../types/interfaces"; // Assuming Nutrients and DailyLog are already defined
import { DailyLogContextType } from "../types/interfaces";
import { getUserDailyLogs } from "@/firebase/funcs/getUserLogs";

const convertToDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); 
};

const DailyLogContext = createContext<DailyLogContextType | undefined>(undefined);

export const DailyLogProvider = ({ children }: { children: ReactNode }) => {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  const fetchDailyLogs = async () => {
    try {
      const fetchedLogs = await getUserDailyLogs();
  
      // Sort logs chronologically by date
      const sortedLogs = fetchedLogs.sort((a, b) => {
        const dateA = convertToDate(a.date);
        const dateB = convertToDate(b.date);
        return dateB.getTime() - dateA.getTime(); 
      });
  
      setDailyLogs(sortedLogs);
    } catch (error) {
      console.error("Error fetching daily logs:", error);
    }
  };

  // Fetch daily logs once on first load
  useEffect(() => {
    fetchDailyLogs()
  }, []);

  return (
    <DailyLogContext.Provider value={{ dailyLogs, setDailyLogs }}>
      {children}
    </DailyLogContext.Provider>
  );
};

export const useDailyLogContext = () => {
  const context = useContext(DailyLogContext);
  if (!context) {
    throw new Error("useDailyLogContext must be used within a DailyLogProvider");
  }
  return context;
};