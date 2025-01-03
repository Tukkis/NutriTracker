import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserChallenge } from "@/types/interfaces";

export const renderChallengeItem = ({ item }: { item: UserChallenge }) => (
  <View style={styles.challengeItem}>
    <Text style={styles.title}>Challenge: {item.name}</Text>
    <Text>Status: {item.completed}</Text>
    <Text>Progress: {item.progress}</Text>
  </View>
);

const styles = StyleSheet.create({
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