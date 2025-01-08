import React from "react";
import { DailyLog } from "@/types/interfaces";
import { Text, View, StyleSheet, Dimensions, Pressable } from "react-native";
import * as Progress from "react-native-progress";

const { width } = Dimensions.get("window");

interface RenderLogItemProps {
  item: DailyLog;
}

export const renderLogItem = ({
  item,
}: RenderLogItemProps) => {
  return (
    <View style={styles.log}>
      <Text style={styles.logtext}>Date: {item.date}</Text>
      <View style={styles.adherenceContainer}>
        <View style={styles.nutrient}>
          <Text style={styles.logtext}>Energy</Text>
          <Progress.Circle
            size={50}
            animated={false}
            progress={item.adherence["energy-kcal"] / 100}
            showsText
            formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
            thickness={8}
            borderWidth={0}
            color="#3b82f6"
            unfilledColor="#e0e0e0"
          />
        </View>
        <View style={styles.nutrient}>
          <Text style={styles.logtext}>Carbs</Text>
          <Progress.Circle
            size={50}
            animated={false}
            progress={item.adherence.carbohydrates_value / 100}
            showsText
            formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
            thickness={8}
            borderWidth={0}
            color="#3b82f6"
            unfilledColor="#e0e0e0"
          />
        </View>
        <View style={styles.nutrient}>
          <Text style={styles.logtext}>Proteins</Text>
          <Progress.Circle
            size={50}
            animated={false}
            progress={item.adherence.proteins_value / 100}
            showsText
            formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
            thickness={8}
            borderWidth={0}
            color="#3b82f6"
            unfilledColor="#e0e0e0"
          />
        </View>
        <View style={styles.nutrient}>
          <Text style={styles.logtext}>Fats</Text>
          <Progress.Circle
            size={50}
            animated={false}
            progress={item.adherence.fat_value / 100}
            showsText
            formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
            thickness={8}
            borderWidth={0}
            color="#3b82f6"
            unfilledColor="#e0e0e0"
          />
        </View>
      </View>
      <View style={styles.nutrient}>
        <Text style={styles.logtext}>Score</Text>
        <Progress.Bar
          width={90}
          animated={false}
          progress={item.score / 100}
          borderWidth={0}
          color="#3b82f6"
          unfilledColor="#e0e0e0"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  log: {
    margin: 10,
    width: width * 0.7,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  logtext: {
    fontSize: 16,
  },
  adherenceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  nutrient: {
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#007BFF",
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#FF4D4D",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});