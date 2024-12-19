import { View, Text, TextInput, StyleSheet, SafeAreaView, Button, Platform } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PlanData } from "@/types/interfaces";
import savePlan from "@/firebase/funcs/savePlan";
import { useRouter } from "expo-router";

const localDate = new Date();
localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

export default function AddPlan() {
  const [plan, setPlan] = useState<PlanData>({
    startDate: localDate,
    endDate: localDate,
    startingWeight: 0,
    goalWeight: 0,
    height: 0,
    age: 0,
    gender: "male",
    activity: "sedentary",
    goal: "fat_loss"
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const router = useRouter(); 

  const handleInputChange = <K extends keyof PlanData>(key: K, value: PlanData[K]) => {
    setPlan((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (key: keyof PlanData, date: Date | undefined) => {
    if (date) {
      // Ensure the date is in local time
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); 
      handleInputChange(key, localDate); // Set the state with the corrected local time date
    }
    if (key === "startDate") {
      setShowStartDatePicker(false);
    } else if (key === "endDate") {
      setShowEndDatePicker(false);
    }
  };

  const validatePlan = (): boolean => {
    if (!plan.startDate || !plan.endDate || plan.startDate > plan.endDate) {
      console.error("Invalid date range.");
      return false;
    }
    if (plan.startingWeight <= 0 || plan.goalWeight <= 0 || plan.height <= 0 || plan.age <= 0) {
      console.error("All numeric fields must be greater than 0.");
      return false;
    }
    if (!plan.gender || !plan.activity || !plan.goal) {
      console.error("Gender, activity and goal must be selected.");
      return false;
    }
    return true;
  };

  const handleSavePlan = () => {
    if (validatePlan()) {
      savePlan(plan)
      router.push("/explore");
    } else {
      console.log("Plan validation failed.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Start Date */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Start Date:</Text>
        <Button
          title={plan.startDate.toISOString().split("T")[0]}
          onPress={() => setShowStartDatePicker(true)}
        />
        {showStartDatePicker && (
          <DateTimePicker
            value={plan.startDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => handleDateChange("startDate", date)}
          />
        )}
      </View>

      {/* End Date */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>End Date:</Text>
        <Button
          title={plan.endDate.toISOString().split("T")[0]}
          onPress={() => setShowEndDatePicker(true)}
        />
        {showEndDatePicker && (
          <DateTimePicker
            value={plan.endDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => handleDateChange("endDate", date)}
          />
        )}
      </View>

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

      {/* Goal Weight */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Goal Weight (kg):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={plan.goalWeight.toString()}
          onChangeText={(text) =>
            handleInputChange("goalWeight", parseFloat(text) || 0)
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

      {/* Activity */}
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

      {/* Goal */}
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
          <Picker.Item label="Maintanance" value="maintenance" />
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