import { UserPlan } from "@/types/interfaces";
import { Text, View, FlatList, StyleSheet, Dimensions } from "react-native";

export const renderPlanItem = ({ item, currentPlanId }: { item: UserPlan; currentPlanId: string | null }) => {
  const isCurrentPlan = currentPlanId === item.id;

  console.log(item)

  return (
    <View style={isCurrentPlan ? styles.currentPlan : styles.planItem}>
      {isCurrentPlan && <Text style={styles.planHeader}>Current Plan:</Text>}
      <Text style={styles.planTitle}>Plan ID: {item.id}</Text>
      <Text>Goal: {item.planData.goal}</Text>
      <Text>Intensity: {item.planData.intensity}</Text>
      <Text>Daily Calories: {item.dailyNutrients?.["energy-kcal"]} kcal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
})