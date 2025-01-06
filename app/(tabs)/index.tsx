import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Button, ActivityIndicator, ScrollView  } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Progress from 'react-native-progress';

import { useEffect, useState } from "react";

import { useDailyLogContext } from "../../contexts/LogContext";
import { usePlanContext } from "@/contexts/PlanContext";

import { updateChallengeProgress } from "@/firebase/funcs/challenge/updateChallengeProgress";
import { UserPlan } from "@/types/interfaces";
import { useChallengeContext } from "@/contexts/ChallengeContext";

const { width } = Dimensions.get("window");

export default function Home() {
  const { todaysLog, userScore, dailyLogs } = useDailyLogContext();
  const { currentPlanId, plans } = usePlanContext();
  const { currentChallenge, fetchChallenges } = useChallengeContext();

  const [currentPlan, setCurrentPlan] = useState<UserPlan|undefined>(undefined)
  const [loading, setLoading] = useState(true);
  const [isAppLaunched, setIsAppLaunched] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isAppLaunched) {
      updateChallengeProgress(dailyLogs[0]);
      setIsAppLaunched(true); 
    } else {
      fetchChallenges()
    }
  }, [isAppLaunched]); 

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);  // Set loading to false after 1
    }, 500); 
  }, []);

  useEffect(() => {
    const foundPlan = plans.find(
      (plan) => plan.id === currentPlanId
    );
    setCurrentPlan(foundPlan)
  }, [currentPlanId]);

  const handleNavigateAddPlan = () => {
    router.push('/planPages/addPlan');
  };

  // If there is no current plan, render only the Add Plan button
  if (currentPlanId === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Home", headerShown: false }} />
        <Text style={styles.title}>Nutri tracker</Text>
        <Button title="Add Plan" onPress={handleNavigateAddPlan} />
      </SafeAreaView>
    );
  }

  // Normal home screen rendering if currentPlanId exists
  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Stack.Screen options={{ title: "Home", headerShown: false }} />
          <Text style={styles.title}>Nutri tracker</Text>
          <Text style={styles.header}>UserScore: {userScore.toFixed(1)}</Text>
          <View style={styles.currentLog}>
            <Text style={styles.text}>Date: {todaysLog.date}</Text>
            <View style={styles.adherenceContainer}>
              <View style={styles.nutrient}>
                <Text style={styles.text}>Energy</Text>
                <Progress.Circle
                  size={50}
                  animated={false}
                  progress={todaysLog.adherence["energy-kcal"] / 100}
                  showsText={true}
                  formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
                  thickness={8}
                  borderWidth={0}
                  color={todaysLog.adherence["energy-kcal"] > 120 ? "red" : "#3b82f6"}
                  unfilledColor="#e0e0e0"
                />
              </View>
              <View style={styles.nutrient}>
                <Text style={styles.text}>Carbs</Text>
                <Progress.Circle
                  size={50}
                  animated={false}
                  progress={todaysLog.adherence.carbohydrates_value / 100}
                  showsText={true}
                  formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
                  thickness={8}
                  borderWidth={0}
                  color={todaysLog.adherence.carbohydrates_value > 120 ? "red" : "#3b82f6"}
                  unfilledColor="#e0e0e0"
                />
              </View>
              <View style={styles.nutrient}>
                <Text style={styles.text}>Proteins</Text>
                <Progress.Circle
                  size={50}
                  animated={false}
                  progress={todaysLog.adherence.proteins_value / 100}
                  showsText={true}
                  formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
                  thickness={8}
                  borderWidth={0}
                  color={todaysLog.adherence.proteins_value > 120 ? "red" : "#3b82f6"}
                  unfilledColor="#e0e0e0"
                />
              </View>
              <View style={styles.nutrient}>
                <Text style={styles.text}>Fats</Text>
                <Progress.Circle
                  size={50}
                  animated={false}
                  progress={todaysLog.adherence.fat_value / 100} 
                  showsText={true}
                  formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
                  thickness={8}
                  borderWidth={0}
                  color={todaysLog.adherence.fat_value > 120 ? "red" : "#3b82f6"}
                  unfilledColor="#e0e0e0"
                />
              </View>
            </View>
            <View style={styles.nutrient}>
              <Text style={styles.text}>Score</Text>
              <Progress.Bar
                  width={90}
                  animated={false}
                  progress={todaysLog.score / 100} 
                  borderWidth={0}
                  color="#3b82f6"
                  unfilledColor="#e0e0e0"
                />
            </View>
          </View>
          {currentChallenge?<View style={styles.challengeItem}>
              <Text style={styles.planHeader}>Current Challenge:</Text>
              <Text style={styles.challengeTitle}>Challenge: {currentChallenge.name}</Text>
              <Text>Status: {currentChallenge.completed ? "Completed" : "Not Completed"}</Text>
              <Text>Progress: {currentChallenge.progress} Days</Text>
              <Text>Gain 10 points for every day if completed successfully</Text>
          </View> : ''}
          <View style={styles.currentPlan}>
            <Text style={styles.planHeader}>Current Plan:</Text>
            <Text style={styles.planTitle}>Plan ID: {currentPlan?.id}</Text>
            <Text>Goal: {currentPlan?.planData.goal}</Text>
            <Text>Intensity: {currentPlan?.planData.intensity}</Text>
            <Text>Daily Calories: {currentPlan?.planData.dailyNutrients?.["energy-kcal"]} kcal</Text>
            <Text>Daily Protein: {currentPlan?.planData.dailyNutrients?.proteins_value} g</Text>
            <Text>Daily Fat: {currentPlan?.planData.dailyNutrients?.fat_value} g</Text>
            <Text>Daily Carbs: {currentPlan?.planData.dailyNutrients?.carbohydrates_value} g</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    )}
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center", 
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16, 
    paddingTop: 80, 
    paddingBottom: 20
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  header: {
    color: "white",
    fontSize: 20,
    marginTop: 10
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  adherenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  nutrient: {
    alignItems: 'center',
  },
  currentLog: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  currentPlan: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
    borderWidth: 1,
  },
  planHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  challengeItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});