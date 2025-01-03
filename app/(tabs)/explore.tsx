import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, Pressable, FlatList, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { getCurrentPlanId } from "@/firebase/funcs/getCurrentPlanId";
import { getUsersPlans } from "@/firebase/funcs/getUserPlans";
import * as Progress from 'react-native-progress';
import { useDailyLogContext } from "../../contexts/LogContext";
import { UserPlan, DailyLog } from "@/types/interfaces";

const { width } = Dimensions.get('window');

// Your existing TabTwoScreen component with additional tab functionality
export default function TabTwoScreen() {
  const [activeTab, setActiveTab] = useState("plans"); // State to manage the active tab
  const [usersPlans, setUsersPlans] = useState<UserPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [logsForCurrentPlan, setLogsForCurrentPlan] = useState<DailyLog[]>([]);
  const { dailyLogs, setDailyLogs } = useDailyLogContext();

  useEffect(() => {
    setLoading(true);
    Promise.all([getUsersPlans(), getCurrentPlanId()])
      .then(([fetchedPlans, fetchedId]) => {
        setUsersPlans(fetchedPlans);
        setCurrentPlanId(fetchedId);
        setLogsForCurrentPlan(dailyLogs.filter(log => log.plan === fetchedId));
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const currentPlan = usersPlans.find((plan) => plan.id === currentPlanId);
  const groupedLogs = dailyLogs.reduce((acc, log) => {
    if (!acc[log.plan]) {
    acc[log.plan] = [];
    }
    acc[log.plan].push(log);

    return acc;
  }, {} as Record<string, DailyLog[]>); 
  const logsArray = Object.values(groupedLogs).flat();

  const calculateAverageScore = (logs: DailyLog[]): number => {
    if (logs.length === 0) return 0;
    const totalScore = logs.reduce((acc, log) => acc + log.score, 0);
    return totalScore / logs.length;
  };

  const averageScore = calculateAverageScore(logsForCurrentPlan);

  const renderPlanItem = ({ item }: { item: UserPlan }) => (
    <View style={styles.planItem}>
      <Text style={styles.planTitle}>Plan ID: {item.id}</Text>
      <Text>Goal: {item.planData.goal}</Text>
      <Text>Intensity: {item.planData.intensity}</Text>
      <Text>Daily Calories: {item.dailyNutrients?.["energy-kcal"]} kcal</Text>
    </View>
  );

  const renderLogItem = ({ item }: { item: DailyLog }) => (
    <FlatList
      data={dailyLogs}
      keyExtractor={(item: DailyLog) => item.date}
      renderItem={({ item }) => (
        <View style={styles.log}>
          <Text style={styles.logtext}>Date: {item.date}</Text>
          <View style={styles.adherenceContainer}>
            <View style={styles.nutrient}>
              <Text style={styles.logtext}>Energy</Text>
              <Progress.Circle
                size={50}
                animated={false}
                progress={item.adherence["energy-kcal"] / 100}
                showsText={true}
                formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
                thickness={8}
                borderWidth={0}
                color="#3b82f6"
                unfilledColor="#e0e0e0"
              />
            </View>
            <View style={styles.nutrient}>
              <Text style={styles.logtext}>Carbs</Text>
              <Progress.Circle
                size={50}
                animated={false}
                progress={item.adherence.carbohydrates_value / 100}
                showsText={true}
                formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
                thickness={8}
                borderWidth={0}
                color="#3b82f6"
                unfilledColor="#e0e0e0"
              />
            </View>
            <View style={styles.nutrient}>
              <Text style={styles.logtext}>Proteins</Text>
              <Progress.Circle
                size={50}
                animated={false}
                progress={item.adherence.proteins_value / 100}
                showsText={true}
                formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
                thickness={8}
                borderWidth={0}
                color="#3b82f6"
                unfilledColor="#e0e0e0"
              />
            </View>
            <View style={styles.nutrient}>
              <Text style={styles.logtext}>Fats</Text>
              <Progress.Circle
                size={50}
                animated={false}
                progress={item.adherence.fat_value / 100} 
                showsText={true}
                formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
                thickness={8}
                borderWidth={0}
                color="#3b82f6"
                unfilledColor="#e0e0e0"
              />
            </View>
          </View>
          <View style={styles.nutrient}>
            <Text style={styles.logtext}>Score</Text>
            <Progress.Bar
                width={90}
                animated={false}
                progress={item.score / 100} 
                borderWidth={0}
                color="#3b82f6"
                unfilledColor="#e0e0e0"
              />
          </View>
        </View>
      )}
    />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "plans":
        return (
          <View> 
            {currentPlan ? (
            <View style={styles.currentPlan}>
              <Text style={styles.planHeader}>Current Plan:</Text>
              <Text style={styles.planTitle}>Plan ID: {currentPlan.id}</Text>
              <Text>Goal: {currentPlan.planData.goal}</Text>
              <Text>Intensity: {currentPlan.planData.intensity}</Text>
              <Text>Daily Calories: {currentPlan.dailyNutrients?.["energy-kcal"]} kcal</Text>
              <Text>Score: {averageScore}</Text>
            </View>
          ) : (
            <Text style={styles.noCurrentPlanText}>No current plan selected</Text>
          )}
          <FlatList
            data={usersPlans}
            keyExtractor={(item) => item.id}
            renderItem={renderPlanItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No plans available</Text>}
          />
          </View> 
        );
      case "logs":
        return (
          <FlatList
          data={logsArray}
          keyExtractor={(item) => item.date}  // Assuming date is unique
          renderItem={({ item }) => renderLogItem({ item })}
          ListEmptyComponent={<Text style={styles.emptyText}>No logs available</Text>}
          />
        );
      case "meals":
        return (
          <Text>Meals Section (This can be a separate component)</Text>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <View>
          {/* Tab Header */}
          <View style={styles.tabHeader}>
            <Pressable
              style={[styles.tabButton, activeTab === "plans" && styles.activeTab]}
              onPress={() => setActiveTab("plans")}
            >
              <Text style={styles.tabButtonText}>Plans</Text>
            </Pressable>
            <Pressable
              style={[styles.tabButton, activeTab === "logs" && styles.activeTab]}
              onPress={() => setActiveTab("logs")}
            >
              <Text style={styles.tabButtonText}>Logs</Text>
            </Pressable>
            <Pressable
              style={[styles.tabButton, activeTab === "meals" && styles.activeTab]}
              onPress={() => setActiveTab("meals")}
            >
              <Text style={styles.tabButtonText}>Meals</Text>
            </Pressable>
          </View>

          {/* Content based on active tab */}
          {renderTabContent()}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingVertical: 16,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    marginTop: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#007BFF",
  },
  tabButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  activeTab: {
    backgroundColor: "#0056b3",
  },
  planItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    borderColor: "#ddd",
    borderWidth: 1,
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
  noCurrentPlanText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginVertical: 16,
  }, 
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  logtext: {
    fontSize: 16,
  },
  nutrient: {
    alignItems: 'center',
  },
  log: {
    margin: 10,
    width: width* 0.7,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  adherenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});