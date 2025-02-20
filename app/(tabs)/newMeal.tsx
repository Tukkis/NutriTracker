import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert, Pressable, Button, FlatList, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from "react-native";
import { Link, useRouter } from "expo-router";

import { useMealContext } from "../../contexts/MealContext";
import { usePlanContext } from "../../contexts/PlanContext";

import { updateChallengeProgress } from "@/firebase/funcs/challenge/updateChallengeProgress";
import saveMeal from "@/firebase/funcs/meal/saveMeal";
import { useEffect, useState } from "react";

export default function AddMeal() {
  const { meal, setMeal, removeMealItem, setMealItem, addMealItem, fetchMeals } = useMealContext();
  const [inputMealItem, setInputMealItem] = useState({
    product_name: "",
    "energy-kcal": "",
    carbohydrates_value: "",
    proteins_value: "",
    fat_value: "",
    amount: ""
  })
  const { currentPlanId } = usePlanContext();
  const router = useRouter();

  const validateMeal = (): boolean => {
    if (!inputMealItem.product_name) {
      Alert.alert("Product name is required.");
      return false;
    }
    const energy = parseFloat(inputMealItem["energy-kcal"]);
    const carbs = parseFloat(inputMealItem.carbohydrates_value);
    const protein = parseFloat(inputMealItem.proteins_value);
    const fats = parseFloat(inputMealItem.fat_value);
    const amount = parseFloat(inputMealItem.amount);
  
    if (isNaN(energy) || isNaN(carbs) || isNaN(protein) || isNaN(fats) || isNaN(amount)) {
      Alert.alert("All numeric fields must be filled.");
      return false;
    }
  
    if (energy <= 0 || carbs < 0 || protein < 0 || fats < 0 || amount <= 0) {
      Alert.alert("All numeric values must be greater than 0.");
      return false;
    }
    return true;
  };

  const handleNavigation = () => {
    router.push('/newMealPages/codeReader');
  };

  const handleAddMealItem = () => {
    if (validateMeal()) {
      addMealItem({
        ...inputMealItem,
        "energy-kcal": parseFloat(inputMealItem["energy-kcal"]) || 0,
        carbohydrates_value: parseFloat(inputMealItem.carbohydrates_value) || 0,
        proteins_value: parseFloat(inputMealItem.proteins_value) || 0,
        fat_value: parseFloat(inputMealItem.fat_value) || 0,
        amount: parseFloat(inputMealItem.amount) || 0,
      });
      setInputMealItem({
        product_name: "",
        "energy-kcal": "",
        carbohydrates_value: "",
        proteins_value: "",
        fat_value: "",
        amount: "",
      });    
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
      updateChallengeProgress(null)
      router.push("/(tabs)");
    } else {
      Alert.alert("No meal to save.");
    }
  };

  const handleDecimalInput = (text: string, key: keyof typeof inputMealItem) => {
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(text)) {
      setInputMealItem({ ...inputMealItem, [key]: text });
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
                  value={inputMealItem.product_name}
                  onChangeText={(text) => setInputMealItem({ ...inputMealItem, product_name: text })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Energy (kcal/100g):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Energy"
                  keyboardType="decimal-pad"
                  value={inputMealItem["energy-kcal"].toString()}
                  onChangeText={(text) => handleDecimalInput(text, "energy-kcal")}
                />
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Carbs (/100g):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Carbs"
                  keyboardType="decimal-pad"
                  value={inputMealItem.carbohydrates_value.toString()}
                  onChangeText={(text) => handleDecimalInput(text, "carbohydrates_value")}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Protein (/100g):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Protein"
                  keyboardType="decimal-pad"
                  value={inputMealItem.proteins_value.toString()}
                  onChangeText={(text) => handleDecimalInput(text, "proteins_value")}
                />
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fats (/100g):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Fats"
                  keyboardType="decimal-pad"
                  value={inputMealItem.fat_value.toString()}
                  onChangeText={(text) => handleDecimalInput(text, "fat_value")}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount: (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  keyboardType="decimal-pad"
                  value={inputMealItem.amount.toString()}
                  onChangeText={(text) => handleDecimalInput(text, "amount")}
                />
              </View>
            </View>

            <Button title="Add item to Meal" onPress={handleAddMealItem} />
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleNavigation}
            >
              <Text style={styles.buttonText}>Scan Barcode with camera</Text>
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
                <Button title="Remove Meal Item" onPress={() => handleRemoveMealItem(Number(index))} />
              </View>
            )}
          />
          <Button title="Save Meal" onPress={handleSaveMeal} />
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