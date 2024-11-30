import { useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Link, Stack } from "expo-router";

import { useCameraPermissions } from "expo-camera";

import { MealItem } from "../../types/interfaces"

export default function Home() {
  
  const [meal,setMeal] = useState([])
  const [mealItem, setMealItem] = useState<MealItem>({
    name: "",
    carbs: 0,
    protein: 0,
    fats: 0
  })

  const handleChange = (key: keyof MealItem, value: string | number) => {
    setMealItem((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "New Meal", headerShown: false }} />
      <Text style={styles.label}>Meal Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={mealItem.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <Text style={styles.label}>Carbs (g):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Carbs"
        value={mealItem.carbs.toString()}
        onChangeText={(text) => handleChange("carbs", parseFloat(text) || 0)}
      />
      <Text style={styles.label}>Protein (g):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Protein"
        value={mealItem.protein.toString()}
        onChangeText={(text) => handleChange("protein", parseFloat(text) || 0)}
      />
      <Text style={styles.label}>Fats (g):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Fats"
        value={mealItem.fats.toString()}
        onChangeText={(text) => handleChange("fats", parseFloat(text) || 0)}
      />
      <Text style={styles.debugText}>Meal Item: {JSON.stringify(mealItem, null, 2)}</Text>
      <Link href={"/newMeal"} asChild>
          <Pressable>
            <Text>
              Scan Code
            </Text>
          </Pressable>
        </Link>
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
  debugText: {
    marginTop: 16,
    fontSize: 14,
    color: "gray",
  },
});
