import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable, Button, FlatList } from "react-native";
import { Nutrients } from "@/types/interfaces";
import { useState } from "react";

export default function AddPlan() {

    const [plan, setPlan] = useState({
        startDate: new Date(),
        endDate: new Date(),
        startingWeight: 0,
        goalWeight: 0,
        height: 0,
    });

    // Generic handler for updating state fields
    const handleInputChange = (key: string, value: any) => {
    setPlan((prev) => ({ ...prev, [key]: value }));
    };

    const handleSavePlan = () => {
    console.log('Plan Saved:', plan);
    };

    return (
    <SafeAreaView style={styles.container}>
        {/* Start Date */}
        <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={plan.startDate.toISOString().split('T')[0]}
        onChangeText={(text) => handleInputChange('startDate', new Date(text))}
        />

        {/* End Date */}
        <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={plan.endDate.toISOString().split('T')[0]}
        onChangeText={(text) => handleInputChange('endDate', new Date(text))}
        />

        {/* Starting Weight */}
        <TextInput
        style={styles.input}
        placeholder="Starting Weight"
        keyboardType="numeric"
        value={plan.startingWeight.toString()}
        onChangeText={(text) =>
            handleInputChange('startingWeight', parseFloat(text) || 0)
        }
        />

        {/* Goal Weight */}
        <TextInput
        style={styles.input}
        placeholder="Goal Weight"
        keyboardType="numeric"
        value={plan.goalWeight.toString()}
        onChangeText={(text) =>
            handleInputChange('goalWeight', parseFloat(text) || 0)
        }
        />

        {/* Height */}
        <TextInput
        style={styles.input}
        placeholder="Height"
        keyboardType="numeric"
        value={plan.height.toString()}
        onChangeText={(text) =>
            handleInputChange('height', parseFloat(text) || 0)
        }
        />

        {/* Save Button */}
        <Button title="Save Plan" onPress={handleSavePlan} />
    </SafeAreaView>
  );
};

// Example styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});