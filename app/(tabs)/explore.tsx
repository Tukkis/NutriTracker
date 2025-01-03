import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, Pressable, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { getCurrentPlanId } from "@/firebase/funcs/getCurrentPlanId";
import { getUsersPlans } from "@/firebase/funcs/getUserPlans";
import { useDailyLogContext } from "../../contexts/LogContext";
import { UserPlan, DailyLog, DataTab, UserChallenge, UserMeal } from "@/types/interfaces";
import { getUserChallenges } from "@/firebase/funcs/getUserChallenges";
import { getUsersMeals } from "@/firebase/funcs/getUsersMeals";
import { useRouter } from "expo-router";

import { renderLogItem } from "@/pageFiles/profileData/components/renderLogItem";
import { renderPlanItem } from "@/pageFiles/profileData/components/renderPlanItem";
import { renderChallengeItem } from "@/pageFiles/profileData/components/renderChallengeItem";
import MealList from "@/pageFiles/profileData/components/MealList"

// Your existing TabTwoScreen component with additional tab functionality
export default function TabTwoScreen() {
  const [meals, setMeals] = useState<UserMeal[]>([])
  const [activeTab, setActiveTab] = useState<DataTab>("plans"); 
  const [usersPlans, setUsersPlans] = useState<UserPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [logsForCurrentPlan, setLogsForCurrentPlan] = useState<DailyLog[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([])
  const { dailyLogs, setDailyLogs } = useDailyLogContext();

  useEffect(() => {
    setLoading(true);
    Promise.all([getUsersPlans(), getCurrentPlanId(), getUserChallenges(), getUsersMeals()])
      .then(([fetchedPlans, fetchedId, fetchedChallenges, fetchedMeals]) => {
        setUsersPlans(fetchedPlans);
        setCurrentPlanId(fetchedId);
        setUserChallenges(fetchedChallenges);
        setMeals(fetchedMeals);
        setLogsForCurrentPlan(dailyLogs.filter(log => log.plan === fetchedId));
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const router = useRouter(); 

  const handlePlanDelete = (planId: string) => {
    setUsersPlans(usersPlans => usersPlans.filter(plan => plan.id !== planId));
    /* deletePlanFromDatabase(planId);  */
  };

  const handlePlanEdit = (plan: UserPlan) => {
    router.push({
      pathname: "/planPages/editPlan",
      params: { plan },
    });
  };

  const handleLogDelete = (logDate: string) => {
    setDailyLogs(dailyLogs => dailyLogs.filter(log => log.date !== logDate));
    /* deletePlanFromDatabase(planId);  */
  };

  const handleLogEdit = (logDate: string) => {
    /* navigation.navigate("EditPlan", { planId }); */
  };
  
  const calculateAverageScore = (logs: DailyLog[]): number => {
    if (logs.length === 0) return 0;
    const totalScore = logs.reduce((acc, log) => acc + log.score, 0);
    return totalScore / logs.length;
  };

  const averageScore = calculateAverageScore(logsForCurrentPlan);

  const handleAddAction = () => {
    switch (activeTab) {
      case "plans":
        router.push("/planPages/addPlan");
        break;
      case "meals":
        router.push("/newMeal");
        break;
      default:
        console.log("Unhandled tab");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "plans":
        return (
          <View>
            <FlatList
              data={usersPlans}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                renderPlanItem({
                  item,
                  currentPlanId,
                  handlePlanEdit,
                  handlePlanDelete,
                })
              }
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.emptyText}>No plans available</Text>}
            />
            <TouchableOpacity style={styles.fab} onPress={handleAddAction}>
              <AntDesign name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        );
      case "logs":
        return (
          <FlatList
          data={dailyLogs}
          keyExtractor={(item) => item.date} 
          renderItem={({ item }) => renderLogItem({ 
            item,
            handleLogEdit,
            handleLogDelete, 
            })
          }
          ListEmptyComponent={<Text style={styles.emptyText}>No logs available</Text>}
          /> 
        );
      case "meals":
        return (
          <View>
            <MealList
            userMeals={meals}
            onEditMeal={(meal) => console.log("Edit meal:", meal)}
            onDeleteMeal={(meal) => console.log("Delete meal:", meal)}
            />
            <TouchableOpacity style={styles.fab} onPress={handleAddAction}>
              <AntDesign name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        );
      case "challenges":
        return (
          <FlatList
          data={userChallenges}
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => renderChallengeItem({ item })}
          ListEmptyComponent={<Text style={styles.emptyText}>No logs available</Text>}
          />
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
        <View style={{ flex: 1 }}>
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
            <Pressable
              style={[styles.tabButton, activeTab === "challenges" && styles.activeTab]}
              onPress={() => setActiveTab("challenges")}
            >
              <Text style={styles.tabButtonText}>Challenges</Text>
            </Pressable>
          </View>
          <View style={styles.constentContainer}>
            {renderTabContent()}
          </View>
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
  constentContainer: {
    alignItems: "center",
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
  fab: {
    position: "absolute",
    right: 16,
    bottom: 66,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});