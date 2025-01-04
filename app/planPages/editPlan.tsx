import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PlanData, UserPlan } from "@/types/interfaces";
import { usePlanContext } from "@/contexts/PlanContext";
import { useRouter } from "expo-router";

export default function EditPlan() {
  const { selectedPlan } = usePlanContext();
  const [plan, setPlan] = useState<PlanData>(selectedPlan?.planData || {
    intensity: "moderate",
    startingWeight: 0,
    height: 0,
    age: 0,
    gender: "male",
    activity: "sedentary",
    goal: "fat_loss",
  });

  const router = useRouter();

  useEffect(() => {
    if (selectedPlan) {
      setPlan(selectedPlan.planData);
    }
  }, [selectedPlan]);

  const handleInputChange = <K extends keyof PlanData>(key: K, value: PlanData[K]) => {
    setPlan((prev) => ({ ...prev, [key]: value }));
  };

  const validatePlan = (): boolean => {
    if (plan.startingWeight <= 0 || plan.height <= 0 || plan.age <= 0) {
      console.error("All numeric fields must be greater than 0.");
      return false;
    }
    if (!plan.gender || !plan.activity || !plan.goal || !plan.intensity) {
      console.error("Gender, activity, goal, and intensity must be selected.");
      return false;
    }
    return true;
  };

  const handleUpdatePlan = async () => {
    if (validatePlan() && selectedPlan) {
      /* try {
        await updatePlan({ ...selectedPlan, planData: plan });
        console.log("Plan updated successfully.");
        router.push("/explore");
      } catch (error) {
        console.error("Error updating plan:", error);
      } */
    } else {
      console.log("Plan validation failed.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Similar Input Fields as AddPlan */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Starting Weight (kg):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={plan.startingWeight.toString()}
          onChangeText={(text) =>
            handleInputChange("startingWeight", parseFloat(text) || 0)
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Height (cm):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={plan.height.toString()}
          onChangeText={(text) =>
            handleInputChange("height", parseFloat(text) || 0)
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={plan.age.toString()}
          onChangeText={(text) => handleInputChange("age", parseInt(text) || 0)}
        />
      </View>
      <View style={styles.inputContainer}>
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
      <View style={styles.inputContainer}>
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
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Plan Goal:</Text>
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
      <View style={styles.inputContainer}>
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

      {/* Save Button */}
      <Button title="Update Plan" onPress={handleUpdatePlan} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
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
  }
})