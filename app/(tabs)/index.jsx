import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Link, Stack } from "expo-router";

import { useEffect, useState } from "react";

import { useCameraPermissions } from "expo-camera";

import { MealItem } from "@/types/interfaces";
import { usePathname } from "expo-router";
import { getUsersMeals } from '../../firebase/funcs/getUsersMeals'

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [meals, setMeals] = useState([]);
  
  const path = usePathname();

  useEffect(() => {
    if (path === "/") {
      getUsersMeals().then(meals => {
        console.log("Resolved meals:", meals);
      }).catch(error => {
        console.error("Error:", error);
      });
    } 
  }, [path])

/*   const isPermissionGranted = Boolean(permission?.granted); */

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Home", headerShown: false }} />
      <Text style={styles.title}>Nutri tracker</Text>
      <View style={{ gap: 20 }}>
        <Text>Profile data</Text>
        <Text>Score/streak</Text>
        <Text>Nutrition data</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
});