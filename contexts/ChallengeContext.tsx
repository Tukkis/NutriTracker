import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserChallenge, ChallengeContextType } from "../types/interfaces";
import { getUserChallenges } from "@/firebase/funcs/getUserChallenges"; 
import { getCurrentChallengeId } from "@/firebase/funcs/getCurrentChallengeId";

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<UserChallenge | null>(null);

  const addChallenge = (newChallenge: UserChallenge) => {
    setChallenges((prevChallenges) => [...prevChallenges, newChallenge]);
    setCurrentChallenge(newChallenge)
  };

  const fetchChallenges = async () => {
    try {
      const fetchedChallenges = await getUserChallenges(); 
      const currentChallengeId = await getCurrentChallengeId()
      setChallenges(fetchedChallenges);
      const currentChallenge = fetchedChallenges.find(
        (challenge) => challenge.id === currentChallengeId
      );
      setCurrentChallenge(currentChallenge || null)
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