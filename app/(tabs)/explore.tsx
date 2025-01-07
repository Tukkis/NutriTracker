import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, Pressable, Button, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { UserPlan, DailyLog, DataTab, UserMeal } from "@/types/interfaces";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth"; 
import { auth } from "@/firebase/firestore";

import { useMealContext } from "@/contexts/MealContext";
import { useDailyLogContext } from "../../contexts/LogContext";
import { usePlanContext } from "@/contexts/PlanContext";
import { useChallengeContext } from "@/contexts/ChallengeContext";

import { renderLogItem } from "@/pageFiles/profileData/components/renderLogItem";
import { renderPlanItem } from "@/pageFiles/profileData/components/renderPlanItem";
import { renderChallengeItem } from "@/pageFiles/profileData/components/renderChallengeItem";
import MealList from "@/pageFiles/profileData/components/MealList"
import { generateUserChallenge } from "@/firebase/funcs/challenge/generateUserChallenge";

// Your existing TabTwoScreen component with additional tab functionality
export default function TabTwoScreen() {
  const [activeTab, setActiveTab] = useState<DataTab>("plans"); 
  const [logsForCurrentPlan, setLogsForCurrentPlan] = useState<DailyLog[]>([]);

  const { challenges, currentChallenge, addChallenge } = useChallengeContext();
  const { meals, setSelectedMeal } =  useMealContext();
  const { plans, setPlans, currentPlanId, setSelectedPlan } =  usePlanContext();
  const { dailyLogs, setDailyLogs } = useDailyLogContext();

  useEffect(() => {
    setLogsForCurrentPlan(dailyLogs.filter(log => log.plan === currentPlanId));
  }, [dailyLogs,currentPlanId]);

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to sign out?");
  
    if (isConfirmed) {
      try {
        await signOut(auth);
        console.log("User signed out successfully");
        router.replace("/login"); // Redirect to the login page
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      console.log("User canceled the logout");
    }
  };
  

  const router = useRouter(); 

  const handlePlanDelete = (planId: string) => {
    setPlans(usersPlans => usersPlans.filter(plan => plan.id !== planId));
    /* deletePlanFromDatabase(planId);  */
  };

  const handlePlanEdit = (plan: UserPlan) => {
    setSelectedPlan(plan)
    router.navigate('../planPages/editPlan');
  };

  const handleMealDelete = (planId: string) => {
    setPlans(usersPlans => usersPlans.filter(plan => plan.id !== planId));
    /* deletePlanFromDatabase(planId);  */
  };

  const handleMealEdit = (selectedMeal: UserMeal) => {
    setSelectedMeal(selectedMeal)
    router.navigate('../newMealPages/editMeal');
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

  const handleAddAction = async () => {
    switch (activeTab) {
      case "plans":
        router.navigate("../planPages/addPlan");
        break;
      case "meals":
        router.navigate("/newMeal");
        break;
        case "challenges":
          const currentPlan = plans.find((plan) => plan.id === currentPlanId);
          if (!currentPlan) {
            console.log("No matching plan found for the currentPlanId.");
            return;
          }
          try {
            const generatedChallenge = await generateUserChallenge(currentPlan);
            if (generatedChallenge) {
              addChallenge(generatedChallenge);
              console.log("Challenge added successfully.");
            }
          } catch (error) {
            console.error("Error generating challenge:", error);
          }
          break;
      default:
        console.log("Unhandled tab");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "plans":
        return (
          <FlatList
            data={plans}
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
        );
      case "logs":
        return (
          <FlatList
          data={dailyLogs}
          keyExtractor={(item) => item.date} 
          renderItem={({ item }) => renderLogItem({ 
            item,
            handleLogEdit,
            })
          }
          ListEmptyComponent={<Text style={styles.emptyText}>No logs available</Text>}
          /> 
        );
      case "meals":
        return (
            <MealList
            userMeals={meals}
            onEditMeal={(meal) => handleMealEdit(meal)}
            onDeleteMeal={(meal) => console.log("Delete meal:", meal)}
            />
        );
      case "challenges":
        return (
          <FlatList
          data={challenges}
          keyExtractor={(item) => item.id || Math.random().toString()}//if id missing 
          renderItem={({ item }) => renderChallengeItem({ 
            item,
            currentChallenge
          })}
          ListEmptyComponent={<Text style={styles.emptyText}>No challenges available</Text>}
          />
        );
      default:
        return null;
    }
  };

  const handleNavigateAddPlan = () => {
    router.push('/planPages/addPlan');
  };

  if (currentPlanId === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Button title="Add Plan to start viewing personal data" onPress={handleNavigateAddPlan} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            style={styles.picker}
          >
            <Picker.Item label="Plans" value="plans" />
            <Picker.Item label="Logs" value="logs" />
            <Picker.Item label="Meals" value="meals" />
            <Picker.Item label="Challenges" value="challenges" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>{renderTabContent()}</View>
      {activeTab !== "logs" && (
        <TouchableOpacity style={styles.fab} onPress={handleAddAction}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Add {activeTab}</Text>
          <AntDesign name="plus" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 16,
  },
  dropdownContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  picker: {
    height: 55,
    color: "#000",
  },
  logoutButton: {
    marginLeft: 16,
    backgroundColor: "#FF4D4D",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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
    paddingHorizontal: 10,
    height: 56,
    borderRadius: 28, 
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6, 
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10, 
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});