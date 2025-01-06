import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable, Button, FlatList, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { useMealContext } from "../../contexts/MealContext";
import { useRouter } from "expo-router";
import { updateMeal } from "@/firebase/funcs/meal/updateMeal";
import { MealItem } from "@/types/interfaces";


export default function EditMeal() {
  const { selectedMeal, fetchMeals, mealItem } = useMealContext();
  const [editingMeal, setEditingMeal] = useState<MealItem[]>([])
  const [editingMealItem, setEditingMealItem] = useState<MealItem>(mealItem)
  const router = useRouter();

  useEffect(() => {
    if(selectedMeal){
      setEditingMeal([...selectedMeal.meals])
    }
  },[selectedMeal])

  const validateMeal = (): boolean => {
    if (!editingMealItem.product_name) {
      console.error("Product name is required.");
      return false;
    }
    if (editingMealItem["energy-kcal"] <= 0 || editingMealItem.carbohydrates_value < 0 || editingMealItem.proteins_value < 0 || editingMealItem.fat_value < 0 || editingMealItem.amount <= 0) {
      console.error("All numeric values must be greater than 0.");
      return false;
    }
    return true;
  };


  const handleAddMeal = () => {
    if(validateMeal()){
      setEditingMeal([...editingMeal, editingMealItem]); 
      setEditingMealItem({ product_name: "", "energy-kcal": 0, carbohydrates_value: 0, proteins_value: 0, fat_value: 0, amount: 0 }); 
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
        console.error("No meal to update.");
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
                onChangeText={(text) =>
                  setEditingMealItem({ ...editingMealItem, "energy-kcal": parseInt(text) || 0 })
                }
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
                onChangeText={(text) =>
                  setEditingMealItem({
                    ...editingMealItem,
                    carbohydrates_value: parseInt(text) || 0,
                  })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Protein (/100g):</Text>
              <TextInput
                style={styles.input}
                placeholder="Protein"
                keyboardType="numeric"
                value={editingMealItem.proteins_value.toString()}
                onChangeText={(text) =>
                  setEditingMealItem({
                    ...editingMealItem,
                    proteins_value: parseInt(text) || 0,
                  })
                }
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
                onChangeText={(text) =>
                  setEditingMealItem({ ...editingMealItem, fat_value: parseInt(text) || 0 })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount: (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={editingMealItem.amount.toString()}
                onChangeText={(text) =>
                  setEditingMealItem({ ...editingMealItem, amount: parseFloat(text) || 0 })
                }
              />
            </View>
          </View>
          <Button title="Add Meal" onPress={handleAddMeal} />
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
                  title="Remove Meal"
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