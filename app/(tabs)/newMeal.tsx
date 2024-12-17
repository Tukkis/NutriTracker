import { useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable, Button, FlatList } from "react-native";
import { Link, useRouter } from "expo-router";

import { useMealContext } from "../../contexts/MealContext";

import saveMeal from "@/firebase/saveMeal";
import { MealItem } from "@/types/interfaces";

export default function AddMeal() {
  const { meal, setMeal } = useMealContext();
  const { addMeal, mealItem, removeMeal, setMealItem } = useMealContext();

  const router = useRouter();

  const handleNavigation = () => {
    router.navigate('/newMealPages')
  };

  const handleAddMeal = () => {
    addMeal(mealItem); 
    setMealItem({ product_name: "", "energy-kcal" : 0, carbohydrates_value: 0, proteins_value: 0, fat_value: 0, amount: 0 }); 
  };

    const handleRemoveMeal = (index: number) => {
      removeMeal(index); 
    };

  const handleSaveMeal = () => {
    if(meal.length > 0){
      saveMeal(meal)
      setMeal([])
    }
    else{
      console.log("No meal");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Meal Name"
        value={mealItem.product_name}
        onChangeText={(text) => setMealItem({ ...mealItem, product_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Energy"
        keyboardType="numeric"
        value={mealItem["energy-kcal"]?.toString()}
        onChangeText={(text) => setMealItem({ ...mealItem, "energy-kcal": parseInt(text) })}
      />
      <TextInput
        style={styles.input}
        placeholder="Carbs"
        keyboardType="numeric"
        value={mealItem.carbohydrates_value.toString()}
        onChangeText={(text) => setMealItem({ ...mealItem, carbohydrates_value: parseInt(text) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Protein"
        keyboardType="numeric"
        value={mealItem.proteins_value.toString()}
        onChangeText={(text) => setMealItem({ ...mealItem, proteins_value: parseInt(text) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Fats"
        keyboardType="numeric"
        value={mealItem.fat_value.toString()}
        onChangeText={(text) => setMealItem({ ...mealItem, fat_value: parseInt(text) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={mealItem.amount.toString()}
        onChangeText={(text) => setMealItem({ ...mealItem, amount: parseFloat(text) || 0 })}
      />
      <Button title="Add Meal" onPress={handleAddMeal} />
      <Button title="Save Meal" onPress={handleSaveMeal} />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={(handleNavigation)} 
      >
        <Text style={styles.buttonText}>Scan Code</Text>
      </Pressable>
      <FlatList
      data={meal}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View>
          <Text>Name: {item.product_name}</Text>
          <Text>Carbs: {item["energy-kcal"]}</Text>
          <Text>Carbs: {item.carbohydrates_value}</Text>
          <Text>Protein: {item.proteins_value}</Text>
          <Text>Fats: {item.fat_value}</Text>
          <Text>Amount: {item.amount}</Text>
          <Button title="Remove Meal" onPress={() => handleRemoveMeal(Number(index))}  />
        </View>
      )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "#0056b3",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
