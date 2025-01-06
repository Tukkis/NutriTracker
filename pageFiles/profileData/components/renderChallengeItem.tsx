import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserChallenge } from "@/types/interfaces";

interface RenderPlanItemProps {
  item: UserChallenge;
  currentChallenge: UserChallenge | null;
}

export const renderChallengeItem = ({
  item,
  currentChallenge,
}: RenderPlanItemProps) => {
  const isCurrentChallenge = currentChallenge?.id === item.id;

  return(
  <View style={isCurrentChallenge ? styles.currentChallenge : styles.challengeItem}>
    {isCurrentChallenge && <Text style={styles.planHeader}>Current Challenge:</Text>}
    <Text style={styles.title}>Challenge: {item.name}</Text>
    <Text>Status: {item.completed}</Text>
    <Text>Progress: {item.progress}</Text>
    <Text>Gain 10 points for every day progressed</Text>
  </View>
)};

const styles = StyleSheet.create({
  currentChallenge: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
    borderWidth: 1,
  },
  planHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 8,
  },
  challengeItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});