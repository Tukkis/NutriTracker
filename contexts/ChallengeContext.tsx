import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserChallenge, ChallengeContextType } from "../types/interfaces";
import { getUserChallenges } from "@/firebase/funcs/challenge/getUserChallenges"; 
import { getCurrentChallengeId } from "@/firebase/funcs/challenge/getCurrentChallengeId";

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<UserChallenge | null>(null);

  const addChallenge = (newChallenge: UserChallenge) => {
    setChallenges((prevChallenges) => [ newChallenge, ...prevChallenges ]);
    setCurrentChallenge(newChallenge)
  };

  const convertToDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day); 
  };  

  const fetchChallenges = async () => {
    try {
      const fetchedChallenges = await getUserChallenges(); 
      const currentChallengeId = await getCurrentChallengeId()

      const currentChallenge = fetchedChallenges.find(
        (challenge) => challenge.id === currentChallengeId
      );
      setCurrentChallenge(currentChallenge || null)

      const sortedChallenges = fetchedChallenges.sort((a, b) => {
        const dateA = convertToDate(a.startDate);
        const dateB = convertToDate(b.startDate);
        return dateB.getTime() - dateA.getTime(); 
      });

      setChallenges(sortedChallenges)
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <ChallengeContext.Provider
      value={{
        challenges,
        setChallenges,
        currentChallenge,
        setCurrentChallenge,
        addChallenge,
        fetchChallenges
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallengeContext = (): ChallengeContextType => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error("useChallengeContext must be used within a ChallengeProvider");
  }
  return context;
};