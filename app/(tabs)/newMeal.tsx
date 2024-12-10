import { useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable, Button, FlatList } from "react-native";
import { Link, useRouter } from "expo-router";

import { useCameraPermissions } from "expo-camera";

import { useMealContext } from "../../contexts/MealContext";

export default function AddMeal() {
  const { meal } = useMealContext();
  const { addMeal } = useMealContext();
  const [newMeal, setNewMeal] = useState({
    name: "",
    carbs: 0,
    protein: 0,
    fats: 0,
  });

  const router = useRouter();

  const handlePress = () => {
    router.navigate('/newMealPages')
  };

  const handleAddMeal = () => {
    addMeal(newMeal); 
    setNewMeal({ name: "", carbs: 0, protein: 0, fats: 0 }); 
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Meal Name"
        value={newMeal.name}
        onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Carbs"
        keyboardType="numeric"
        value={newMeal.carbs.toString()}
        onChangeText={(text) => setNewMeal({ ...newMeal, carbs: parseInt(text) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Protein"
        keyboardType="numeric"
        value={newMeal.protein.toString()}
        onChangeText={(text) => setNewMeal({ ...newMeal, protein: parseInt(text) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Fats"
        keyboardType="numeric"
        value={newMeal.fats.toString()}
        onChangeText={(text) => setNewMeal({ ...newMeal, fats: parseInt(text) || 0 })}
      />
      <Button title="Add Meal" onPress={handleAddMeal} />
      <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={(handlePress)} 
    >
      <Text style={styles.buttonText}>Scan Code</Text>
    </Pressable>
      <FlatList
      data={meal}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>Name: {item.name}</Text>
          <Text>Carbs: {item.carbs}</Text>
          <Text>Protein: {item.protein}</Text>
          <Text>Fats: {item.fats}</Text>
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
