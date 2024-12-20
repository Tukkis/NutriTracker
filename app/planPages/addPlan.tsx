import { View, Text, TextInput, StyleSheet, SafeAreaView, Button, Platform } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { PlanData } from "@/types/interfaces";
import savePlan from "@/firebase/funcs/savePlan";
import { useRouter } from "expo-router";

const localDate = new Date();
localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

export default function AddPlan() {
  const [plan, setPlan] = useState<PlanData>({
    intensity: "moderate", // Default intensity
    startingWeight: 0,
    height: 0,
    age: 0,
    gender: "male",
    activity: "sedentary",
    goal: "fat_loss"
  });

  const router = useRouter(); 

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

  const handleSavePlan = () => {
    if (validatePlan()) {
      savePlan(plan);
      router.push("/explore");
    } else {
      console.log("Plan validation failed.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Starting Weight */}
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

      {/* Height */}
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

      {/* Age */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={plan.age.toString()}
          onChangeText={(text) => handleInputChange("age", parseInt(text) || 0)}
        />
      </View>

      {/* Gender */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender:</Text>
        <Picker
          selectedValue={plan.gender}
          onValueChange={(value) => handleInputChange("gender", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      {/* Activity Level */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Activity Level:</Text>
        <Picker
          selectedValue={plan.activity}
          onValueChange={(value) => handleInputChange("activity", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Activity Level" value="" />
          <Picker.Item label="Sedentary" value="sedentary" />
          <Picker.Item label="Lightly Active" value="lightly_active" />
          <Picker.Item label="Moderately Active" value="moderately_active" />
          <Picker.Item label="Very Active" value="very_active" />
          <Picker.Item label="Super Active" value="super_active" />
        </Picker>
      </View>

      {/* Plan Goal */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Plan goal:</Text>
        <Picker
          selectedValue={plan.goal}
          onValueChange={(value) => handleInputChange("goal", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Your Goal" value="" />
          <Picker.Item label="Fat Loss" value="fat_loss" />
          <Picker.Item label="Muscle Gain" value="muscle_gain" />
          <Picker.Item label="Maintenance" value="maintenance" />
        </Picker>
      </View>

      {/* Plan Intensity */}
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
      <Button title="Save Plan" onPress={handleSavePlan} />
    </SafeAreaView>
  );
}

// Example styles
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
  },
});