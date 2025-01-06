import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable, Button, FlatList, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from "react-native";
import { Link, useRouter } from "expo-router";

import { useMealContext } from "../../contexts/MealContext";
import { usePlanContext } from "../../contexts/PlanContext";

import saveMeal from "@/firebase/funcs/meal/saveMeal";
import { useEffect } from "react";

export default function AddMeal() {
  const { meal, setMeal, mealItem, removeMealItem, setMealItem, addMealItem, fetchMeals } = useMealContext();
  const { currentPlanId } = usePlanContext();
  const router = useRouter();

  const validateMeal = (): boolean => {
    if (!mealItem.product_name) {
      console.error("Product name is required.");
      return false;
    }
    if (mealItem["energy-kcal"] <= 0 || mealItem.carbohydrates_value < 0 || mealItem.proteins_value < 0 || mealItem.fat_value < 0 || mealItem.amount <= 0) {
      console.error("All numeric values must be greater than 0.");
      return false;
    }
    return true;
  };

  const handleNavigation = () => {
    router.push('/newMealPages/codeReader');
  };

  const handleAddMealItem = () => {
    if (validateMeal()) {
      addMealItem(mealItem);
      setMealItem({ product_name: "", "energy-kcal": 0, carbohydrates_value: 0, proteins_value: 0, fat_value: 0, amount: 0 });
    } else {
      console.error("Meal validation failed");
    }
  };

  const handleRemoveMealItem = (index: number) => {
    removeMealItem(index);
  };

  const saveMealAndFetch = async () => {
    await saveMeal(meal);
    await fetchMeals();
    setMeal([]);
  };

  const handleSaveMeal = () => {
    if (meal.length > 0) {
      saveMealAndFetch();
      // updateChallengeProgress()  // Assuming challenge progress update
      router.push("/(tabs)");
    } else {
      console.error("No meal to save.");
    }
  };

  const handleNavigateAddPlan = () => {
    router.push('/planPages/addPlan');
  };

  if (currentPlanId === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Button title="Add Plan to add meals" onPress={handleNavigateAddPlan} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={styles.formContainer}>
            <View style={styles.rowContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Food name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Meal Name"
                  value={mealItem.product_name}
                  onChangeText={(text) => setMealItem({ ...mealItem, product_name: text })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Energy (kcal/100g):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Energy"
                  keyboardType="numeric"
                  value={mealItem["energy-kcal"]?.toString()}
                  onChangeText={(text) => setMealItem({ ...mealItem, "energy-kcal": parseInt(text) || 0 })}
                />
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Carbs (/100g):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Carbs"
                  keyboardType="numeric"
                  value={mealItem.carbohydrates_value.toString()}
                  onChangeText={(text) => setMealItem({ ...mealItem, carbohydrates_value: parseInt(text) || 0 })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Protein (/100g):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Protein"
                  keyboardType="numeric"
                  value={mealItem.proteins_value.toString()}
                  onChangeText={(text) => setMealItem({ ...mealItem, proteins_value: parseInt(text) || 0 })}
                />
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fats (/100g):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Fats"
                  keyboardType="numeric"
                  value={mealItem.fat_value.toString()}
                  onChangeText={(text) => setMealItem({ ...mealItem, fat_value: parseInt(text) || 0 })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount: (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={mealItem.amount.toString()}
                  onChangeText={(text) => setMealItem({ ...mealItem, amount: parseFloat(text) || 0 })}
                />
              </View>
            </View>

            <Button title="Add Meal" onPress={handleAddMealItem} />
            <Button title="Save Meal" onPress={handleSaveMeal} />
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleNavigation}
            >
              <Text style={styles.buttonText}>Scan Code</Text>
            </Pressable>
          </View>

          <FlatList
            data={meal}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View>
                <Text>Name: {item.product_name}</Text>
                <Text>Energy: {item["energy-kcal"]}</Text>
                <Text>Carbs: {item.carbohydrates_value}</Text>
                <Text>Protein: {item.proteins_value}</Text>
                <Text>Fats: {item.fat_value}</Text>
                <Text>Amount: {item.amount}</Text>
                <Button title="Remove Meal" onPress={() => handleRemoveMealItem(Number(index))} />
              </View>
            )}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 32,
    backgroundColor: "#fff",
    flex: 1,
  },
  formContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inputContainer: {
    width: "48%",  // Set width for each input container to make them side by side
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
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