import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { UserMeal, MealItem } from "@/types/interfaces";

interface MealListProps {
  userMeals: UserMeal[];
  onEditMeal: (meal: UserMeal) => void;
  onDeleteMeal: (meal: UserMeal) => void;
}

// Render Meal Item
const renderMealItem = ({ item }: { item: MealItem }) => {
  return (
    <View style={styles.mealContainer}>
      <Text style={styles.mealName}>{item.product_name}</Text>
      <Text style={styles.mealDescription}>{item.amount}g</Text>

      <View style={styles.nutrientContainer}>
        <Text style={styles.nutrientText}>Calories: {item["energy-kcal"]} kcal</Text>
        <Text style={styles.nutrientText}>Carbs: {item.carbohydrates_value}/100g</Text>
        <Text style={styles.nutrientText}>Proteins: {item.proteins_value}/100g</Text>
        <Text style={styles.nutrientText}>Fats: {item.fat_value}/100g</Text>
      </View>

      
    </View>
  );
};

// Main component
const MealList: React.FC<MealListProps> = ({ userMeals, onEditMeal, onDeleteMeal }) => {
  return (
    <FlatList
      data={userMeals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text style={styles.dateHeader}>{item.date}</Text>
          <FlatList
            data={item.meals}
            keyExtractor={(mealItem) => mealItem.product_name}
            renderItem={({ item: mealItem }) => renderMealItem({ item: mealItem })}
          />
          <View style={styles.actionButtons}>
            <Pressable style={styles.editButton} onPress={() => onEditMeal(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => onDeleteMeal(item)}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      )}
      contentContainerStyle={styles.flatListContainer}
      ListEmptyComponent={<Text style={styles.emptyText}>No plans available</Text>}
    />
  );
};

const styles = StyleSheet.create({
  mealContainer: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  mealDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  nutrientContainer: {
    paddingTop: 8,
  },
  nutrientText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    paddingTop: 16,
  },
  flatListContainer: {
    paddingBottom: 120,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
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

export default MealList;