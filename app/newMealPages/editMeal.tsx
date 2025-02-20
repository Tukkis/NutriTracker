import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert, Pressable, Button, FlatList, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { useMealContext } from "../../contexts/MealContext";
import { useRouter } from "expo-router";
import { updateMeal } from "@/firebase/funcs/meal/updateMeal";
import { MealItem } from "@/types/interfaces";


export default function EditMeal() {
  const { selectedMeal, fetchMeals, mealItem } = useMealContext();
  const [editingMeal, setEditingMeal] = useState<MealItem[]>([])
  const [editingMealItem, setEditingMealItem] = useState({
    product_name: "",
    "energy-kcal": "",
    carbohydrates_value: "",
    proteins_value: "",
    fat_value: "",
    amount: ""
  })
  const router = useRouter();

  useEffect(() => {
    if(selectedMeal){
      setEditingMeal([...selectedMeal.meals])
    }
  },[selectedMeal])

  const validateMeal = (): boolean => {
    if (!editingMealItem.product_name) {
      Alert.alert("Product name is required.");
      return false;
    }
    const energy = parseFloat(editingMealItem["energy-kcal"]);
    const carbs = parseFloat(editingMealItem.carbohydrates_value);
    const protein = parseFloat(editingMealItem.proteins_value);
    const fats = parseFloat(editingMealItem.fat_value);
    const amount = parseFloat(editingMealItem.amount);
  
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


  const handleAddMeal = () => {
    if(validateMeal()){
      setEditingMeal([...editingMeal, {
        product_name: editingMealItem.product_name,
        "energy-kcal": parseFloat(editingMealItem["energy-kcal"]) || 0,
        carbohydrates_value: parseFloat(editingMealItem.carbohydrates_value) || 0,
        proteins_value: parseFloat(editingMealItem.proteins_value) || 0,
        fat_value: parseFloat(editingMealItem.fat_value) || 0,
        amount: parseFloat(editingMealItem.amount) || 0,}]); 
      setEditingMealItem({  
        product_name: "",
        "energy-kcal": "",
        carbohydrates_value: "",
        proteins_value: "",
        fat_value: "",
        amount: "",
      }); 
    } else {
      console.error("Meal validation failed")
    }
  };

  const handleRemoveMealItem = (mealIndex: number) => {
    setEditingMeal(((prevMeals) => prevMeals.filter((_, index) => index !== mealIndex))); 
  };

  const updateMealAndFetch = async () => {
    await updateMeal(selectedMeal, editingMeal); 
    await fetchMeals();                   
    setEditingMeal([]);                          
  };

  const handleUpdateMeal = () => {
      if (editingMeal.length > 0) {
        updateMealAndFetch()
        router.push("/(tabs)");
      } else {
        Alert.alert("No meal to update.");
      }
    };

  const handleDecimalInput = (text: string, key: keyof typeof editingMealItem) => {
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(text)) {
      setEditingMealItem({ ...editingMealItem, [key]: text });
    }
  };

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
                value={editingMealItem.product_name}
                onChangeText={(text) =>
                  setEditingMealItem({ ...editingMealItem, product_name: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Energy (kcal/100g):</Text>
              <TextInput
                style={styles.input}
                placeholder="Energy"
                keyboardType="numeric"
                value={editingMealItem["energy-kcal"]?.toString()}
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
                keyboardType="numeric"
                value={editingMealItem.carbohydrates_value.toString()}
                onChangeText={(text) => handleDecimalInput(text, "energy-kcal")}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Protein (/100g):</Text>
              <TextInput
                style={styles.input}
                placeholder="Protein"
                keyboardType="numeric"
                value={editingMealItem.proteins_value.toString()}
                onChangeText={(text) => handleDecimalInput(text, "energy-kcal")}
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
                value={editingMealItem.fat_value.toString()}
                onChangeText={(text) => handleDecimalInput(text, "energy-kcal")}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount: (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={editingMealItem.amount.toString()}
                onChangeText={(text) => handleDecimalInput(text, "energy-kcal")}
              />
            </View>
          </View>
          <Button title="Add Meal Item" onPress={handleAddMeal} />
          <Button title="Save Meal" onPress={handleUpdateMeal} />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('/newMealPages/codeReader')}
          >
            <Text style={styles.buttonText}>Scan Code</Text>
          </Pressable>
        </View>
          <FlatList
            data={editingMeal}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View>
                <Text>Name: {item.product_name}</Text>
                <Text>Energy: {item["energy-kcal"]}</Text>
                <Text>Carbs: {item.carbohydrates_value}</Text>
                <Text>Protein: {item.proteins_value}</Text>
                <Text>Fats: {item.fat_value}</Text>
                <Text>Amount: {item.amount}</Text>
                <Button
                  title="Remove Meal Item"
                  onPress={() => handleRemoveMealItem(Number(index))}
                />
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