import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, Button, ScrollView, Alert, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PlanData, UserPlan } from "@/types/interfaces";
import { usePlanContext } from "@/contexts/PlanContext";
import { useRouter } from "expo-router";
import calculateDailyNutrients from "@/firebase/helpers/calculateDailyNutrients";  
import { KeyboardAvoidingView } from "react-native";
import { updatePlan } from "@/firebase/funcs/plan/updatePlan";

const EditPlan = () => {
  const { selectedPlan, editPlan } = usePlanContext();
  const [plan, setPlan] = useState<PlanData>(selectedPlan?.planData || {
    intensity: "moderate",
    startingWeight: 0,
    height: 0,
    age: 0,
    gender: "male",
    activity: "sedentary",
    goal: "fat_loss",
    dailyNutrients: {
      "energy-kcal": 0,
      carbohydrates_value: 0,
      proteins_value: 0,
      fat_value: 0,
    },
  });

  const router = useRouter();

  const handleInputChange = <K extends keyof PlanData>(key: K, value: PlanData[K]) => {
    setPlan((prev) => {
      const updatedPlan = { ...prev, [key]: value };
      if (key !== "dailyNutrients") {
        updatedPlan.dailyNutrients = calculateDailyNutrients(updatedPlan); // Recalculate daily nutrients
      }
      return updatedPlan;
    });
  };

  const validatePlan = (): boolean => {
    if (plan.startingWeight <= 0 || plan.height <= 0 || plan.age <= 0) {
      Alert.alert("All numeric fields must be greater than 0.");
      return false;
    }
    if (!plan.gender || !plan.activity || !plan.goal || !plan.intensity) {
      Alert.alert("Gender, activity, goal, and intensity must be selected.");
      return false;
    }
    return true;
  };

  const handleUpdatePlan = () => {
    if (validatePlan()) {
      // Perform the update logic here
      const updatedPlan : UserPlan = {
        id: selectedPlan.id,
        userId: selectedPlan.userId,
        planData: plan
      }
      updatePlan(updatedPlan, editPlan);
      Alert.alert('Notice', 'If you have logged meals for today new plan will start tomorrow', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      router.push("/personal");
    } else {
      console.log("Plan validation failed.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View>
              <Text style={styles.label}>Plan name</Text>
              <TextInput
                  style={styles.input}
                  value={plan.name}
                  onChangeText={(text) => handleInputChange("name", text || '')}
                />
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfContainer}>
                <Text style={styles.label}>Weight (kg):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={plan.startingWeight.toString()}
                  onChangeText={(text) => handleInputChange("startingWeight", parseFloat(text) || 0)}
                />
              </View>

              <View style={styles.halfContainer}>
                <Text style={styles.label}>Height (cm):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={plan.height.toString()}
                  onChangeText={(text) => handleInputChange("height", parseFloat(text) || 0)}
                />
              </View>
            </View>

            <View style={styles.halfContainer}>
              <Text style={styles.label}>Age:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={plan.age.toString()}
                onChangeText={(text) => handleInputChange("age", parseInt(text) || 0)}
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfContainer}>
                <Text style={styles.label}>Gender:</Text>
                <Picker
                  selectedValue={plan.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>

              <View style={styles.halfContainer}>
                <Text style={styles.label}>Activity Level:</Text>
                <Picker
                  selectedValue={plan.activity}
                  onValueChange={(value) => handleInputChange("activity", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Sedentary" value="sedentary" />
                  <Picker.Item label="Lightly Active" value="lightly_active" />
                  <Picker.Item label="Moderately Active" value="moderately_active" />
                  <Picker.Item label="Very Active" value="very_active" />
                  <Picker.Item label="Super Active" value="super_active" />
                </Picker>
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfContainer}>
                <Text style={styles.label}>Plan goal:</Text>
                <Picker
                  selectedValue={plan.goal}
                  onValueChange={(value) => handleInputChange("goal", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Fat Loss" value="fat_loss" />
                  <Picker.Item label="Muscle Gain" value="muscle_gain" />
                  <Picker.Item label="Maintenance" value="maintenance" />
                </Picker>
              </View>

              <View style={styles.halfContainer}>
                <Text style={styles.label}>Diet Intensity:</Text>
                <Picker
                  selectedValue={plan.intensity}
                  onValueChange={(value) => handleInputChange("intensity", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Easy" value="easy" />
                  <Picker.Item label="Moderate" value="moderate" />
                  <Picker.Item label="Hard" value="hard" />
                </Picker>
              </View>
            </View>

            <View style={styles.nutrientContainer}>
              <Text style={styles.label}>Daily Nutrients:</Text>
              <View style={styles.rowContainer}>
                <Text style={styles.halfContainer}>Energy (kcal): {plan.dailyNutrients["energy-kcal"]}</Text>
                <Text style={styles.halfContainer}>Carbs (g): {plan.dailyNutrients.carbohydrates_value}</Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.halfContainer}>Proteins (g): {plan.dailyNutrients.proteins_value}</Text>
                <Text style={styles.halfContainer}>Fat (g): {plan.dailyNutrients.fat_value}</Text>
              </View>
            </View>

            <Button title="Update Plan" onPress={handleUpdatePlan} />
          </KeyboardAvoidingView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 32,
    justifyContent: "center",
    backgroundColor: "white",
  },
  scrollViewContainer: {
    paddingBottom: 100,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  halfContainer: {
    width: "48%",
  },
  nutrientContainer: {
    flex: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    flexShrink: 1
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default EditPlan;