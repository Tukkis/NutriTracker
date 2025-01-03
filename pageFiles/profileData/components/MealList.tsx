import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { UserMeal, MealItem } from "@/types/interfaces"; // Ensure correct imports

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
const MealList: React.FC<{ userMeals: UserMeal[] }> = ({ userMeals }) => {
  return (
    <FlatList
      data={userMeals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text style={styles.dateHeader}>{item.date}</Text> 
          <FlatList
            data={item.meals} // Meals array inside UserMeal
            keyExtractor={(mealItem) => mealItem.product_name} // Can also use meal ID if available
            renderItem={renderMealItem} // Render each meal item
          />
        </View>
      )}
      contentContainerStyle={styles.flatListContainer}
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
    color: "blue",
    paddingTop: 16,
  },
  flatListContainer: {
    paddingBottom: 120, 
  },
});

export default MealList;
