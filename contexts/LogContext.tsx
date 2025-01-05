import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Nutrients, DailyLog } from "../types/interfaces"; // Assuming Nutrients and DailyLog are already defined
import { DailyLogContextType } from "../types/interfaces";
import { getUserDailyLogs } from "@/firebase/funcs/getUserLogs";
import { getUserScore } from "@/firebase/funcs/getUserScore";
import { useMealContext } from './MealContext';

const now = new Date();
const day = String(now.getDate()).padStart(2, "0");
const month = String(now.getMonth() + 1).padStart(2, "0");
const year = now.getFullYear();
const dateString = `${day}-${month}-${year}`;

const convertToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); 
};

const DailyLogContext = createContext<DailyLogContextType | undefined>(undefined);

export const DailyLogProvider = ({ children }: { children: ReactNode }) => {
  const [userScore, setUserScore] = useState<number>(0)
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [todaysLog, setTodaysLog] = useState<DailyLog>({
    date: dateString,
    totalIntake: {
      "energy-kcal": 0,
      carbohydrates_value: 0,
      proteins_value: 0,
      fat_value: 0,
    },
    dailyNutrients: {
      "energy-kcal": 0,
      carbohydrates_value: 0,
      proteins_value: 0,
      fat_value: 0,
    },
    adherence: {
      "energy-kcal": 0,
      carbohydrates_value: 0,
      proteins_value: 0,
      fat_value: 0,
    },
    plan: '',
    score: 0,
  })

  const { meals } = useMealContext();

  const fetchDailyLogs = async () => {
    try {
      const fetchedLogs = await getUserDailyLogs();
      const fetchedScore = await getUserScore()

      if(fetchedScore){
        setUserScore(Number(fetchedScore))
      }

      // Sort logs chronologically by date
      const sortedLogs = fetchedLogs.sort((a, b) => {
        const dateA = convertToDate(a.date);
        const dateB = convertToDate(b.date);
        return dateB.getTime() - dateA.getTime(); 
      });
      const todaysLog = fetchedLogs.find((log) => log.date === dateString);
      // Set the logs state
      if (todaysLog) {
        setTodaysLog(todaysLog);
      }
      setDailyLogs(sortedLogs);
    } catch (error) {
      console.error("Error fetching daily logs:", error);
    }
  };

  // Fetch daily logs once on first load
  useEffect(() => {
    fetchDailyLogs();
  }, [meals]);

  // Get today's date as a string (day-month-year)
  

  return (
    <DailyLogContext.Provider value={{ dailyLogs, setDailyLogs, todaysLog, setTodaysLog, userScore }}>
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