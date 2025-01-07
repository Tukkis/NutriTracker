import React, { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import { ChallengeProvider, useChallengeContext } from "@/contexts/ChallengeContext";
import { UserChallenge } from "@/types/interfaces";

jest.mock('@/firebase/funcs/challenge/getUserChallenges', () => ({
  getUserChallenges: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/firebase/funcs/challenge/getCurrentChallengeId', () => ({
  getCurrentChallengeId: jest.fn().mockResolvedValue(null),
}));

it("adds a new challenge and sets it as current", async () => {
  const newChallenge: UserChallenge = {
    id: "3",
    challengeId: "c123",
    name: "New Challenge",
    startDate: "2025-01-06",
    endDate: "2025-01-13",
    duration: 7,
    dailyProgress: 0,
    progress: 0,
    lastTracked: "",
    completed: false,
    targetNutrients: {
      "energy-kcal": 2000,
      proteins_value: 100,
      carbohydrates_value: 250,
      fat_value: 70,
    },
  };

  const TestComponent = () => {
    const { addChallenge, challenges, currentChallenge } = useChallengeContext();

    useEffect(() => {
      addChallenge(newChallenge);
    }, []);

    return (
      <>
        <div>Challenges: {JSON.stringify(challenges)}</div>
        <div>Current Challenge: {currentChallenge?.name}</div>
      </>
    );
  };

  render(
    <ChallengeProvider>
      <TestComponent />
    </ChallengeProvider>
  );

  // Use `findByText` to wait for the elements to appear
  const challengeText = await screen.findByText(/Challenges: \[.*New Challenge.*\]/);
  const currentChallengeText = await screen.findByText(/Current Challenge: .*New Challenge.*/);

  expect(challengeText).toBeTruthy();
  expect(currentChallengeText).toBeTruthy();
});