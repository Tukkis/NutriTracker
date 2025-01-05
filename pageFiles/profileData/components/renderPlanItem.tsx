import { UserPlan } from "@/types/interfaces";
import { Text, View, FlatList, StyleSheet, Dimensions, Pressable } from "react-native";

interface RenderPlanItemProps {
  item: UserPlan;
  currentPlanId: string | null;
  handlePlanEdit: (plan: UserPlan) => void; 
  handlePlanDelete: (planId: string) => void;
}

export const renderPlanItem = ({
  item,
  currentPlanId,
  handlePlanEdit,
  handlePlanDelete,
}: RenderPlanItemProps) => {
  const isCurrentPlan = currentPlanId === item.id;

  return (
    <View style={isCurrentPlan ? styles.currentPlan : styles.planItem}>
      {isCurrentPlan && <Text style={styles.planHeader}>Current Plan:</Text>}
      <Text style={styles.planTitle}>Plan ID: {item.id}</Text>
      <Text>Goal: {item.planData.goal}</Text>
      <Text>Intensity: {item.planData.intensity}</Text>
      <Text>Daily Calories: {item.planData.dailyNutrients?.["energy-kcal"]} kcal</Text>
      <Text>Daily Protein: {item.planData.dailyNutrients?.proteins_value} g</Text>
      <Text>Daily Fat: {item.planData.dailyNutrients?.fat_value} g</Text>
      <Text>Daily Carbs: {item.planData.dailyNutrients?.carbohydrates_value} g</Text>

      <View style={styles.actionButtons}>
        <Pressable style={styles.editButton} onPress={() => handlePlanEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={() => handlePlanDelete(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>
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
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#007BFF",
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#FF4D4D",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});