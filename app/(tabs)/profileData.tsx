import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, Pressable, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
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
import { deleteMeal } from "@/firebase/funcs/meal/deleteMeal";

// Your existing TabTwoScreen component with additional tab functionality
export default function TabTwoScreen() {
  const [activeTab, setActiveTab] = useState<DataTab>("plans"); 
  const [logsForCurrentPlan, setLogsForCurrentPlan] = useState<DailyLog[]>([]);

  const { challenges, currentChallenge, addChallenge } = useChallengeContext();
  const { meals, setSelectedMeal, setMeals } =  useMealContext();
  const { plans, setPlans, currentPlanId, setSelectedPlan } =  usePlanContext();
  const { dailyLogs, setDailyLogs } = useDailyLogContext();

  useEffect(() => {
    setLogsForCurrentPlan(dailyLogs.filter(log => log.plan === currentPlanId));
  }, [dailyLogs,currentPlanId]);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("User canceled the logout"),
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            try {
              await signOut(auth);
              console.log("User signed out successfully");
              router.replace("/login"); // Redirect to the login page
            } catch (error: any) {
              Alert.alert("Error signing out:", error);
            }
          }
        }
      ]
    );
  };
  

  const router = useRouter(); 

  const handlePlanEdit = (plan: UserPlan) => {
    setSelectedPlan(plan)
    router.navigate('../planPages/editPlan');
  };

  const handleMealDelete = (mealToDelete: UserMeal) => {
    setMeals(meals => meals.filter(meal => meal.id !== mealToDelete.id));
    deleteMeal(mealToDelete)
  };

  const handleMealEdit = (selectedMeal: UserMeal) => {
    setSelectedMeal(selectedMeal)
    router.navigate('../newMealPages/editMeal');
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
          } catch (error: any) {
            Alert.alert("Error generating challenge:", error);
          }
          break;
      default:
        console.log("Unhandled tab");
    }
  };

  const handleInfoPress = () => {
    let message = "";
    switch (activeTab) {
      case "plans":
        message = "Plans determine daily nutritional targets. Calories = BMR * activity multiplier. Macro nutrient distribution is calculated by Goal & Intensity multipliers";
        break;
      case "logs":
        message = "Logs track meals recorded for the current day. Logs adherence and score are based on the plan at the point of adding the first meal of the day.";
        break;
      case "meals":
        message = "Meals are created by adding meal items, either manually or via barcode scanning. The total macronutrients of a meal are summed from its items when saving a meal.";
        break;
      case "challenges":
        message = "Challenges are generated from a pool of possible tasks. You earn points based on how many days you complete the challenge constraints (e.g., reaching a protein goal) within the given time period.";
        break;
      default:
        message = "This section provides insights into your nutrition tracking.";
    }
    Alert.alert("Info", message, [{ text: "OK" }]);
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
            })
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No logs available</Text>}
          /> 
        );
      case "meals":
        return (
            <MealList
            userMeals={meals}
            onEditMeal={(meal) => handleMealEdit(meal)}
            onDeleteMeal={(meal) => handleMealDelete(meal)}
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
        <TouchableOpacity style={styles.infoButton} onPress={handleInfoPress}>
          <AntDesign name="infocirlceo" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, width:'100%' }}>{renderTabContent()}</View>
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
    paddingTop: 42
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
  infoButton: {
    marginLeft: 12,
    padding: 10,
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