import { StyleSheet, SafeAreaView, Text, View, Pressable, FlatList, ActivityIndicator } from "react-native";
import { DailyLog, Nutrients, UserPlan } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { getCurrentPlanId } from "@/firebase/funcs/getCurrentPlanId";
import { getUsersPlans } from "@/firebase/funcs/getUserPlans";
import { getPlanLogs } from "@/firebase/funcs/getPlanLogs";

export default function TabTwoScreen() {
  const [usersPlans, setUsersPlans] = useState<UserPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [logsForCurrentPlan, setLogsForCurrentPlan] = useState<DailyLog[]>([]);

  const path = usePathname();
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/planPages/addPlan");
  };

  useEffect(() => {
    if (path === "/explore") {
      setLoading(true);
      // Fetch plans and current plan ID
      Promise.all([getUsersPlans(), getCurrentPlanId()])
        .then(([fetchedPlans, fetchedId]) => {
          setUsersPlans(fetchedPlans);
          setCurrentPlanId(fetchedId);
          getPlanLogs(fetchedId).then(fetchedLogs => {
            setLogsForCurrentPlan(fetchedLogs)
          })
          .catch((error) => {
            console.error("Error:", error);
          })
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [path]);

  const currentPlan = usersPlans.find((plan) => plan.id === currentPlanId);

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

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
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

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleNavigation}
          >
            <Text style={styles.buttonText}>Add Plan</Text>
          </Pressable>

          <FlatList
            data={usersPlans}
            keyExtractor={(item) => item.id}
            renderItem={renderPlanItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No plans available</Text>}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingVertical: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 16,
  },
  buttonPressed: {
    backgroundColor: "#0056b3",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  planItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
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
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});