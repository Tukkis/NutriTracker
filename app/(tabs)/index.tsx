import { View, Text, StyleSheet, SafeAreaView, Pressable, FlatList } from "react-native";
import { Link, Stack } from "expo-router";

import { useEffect, useState } from "react";

import { MealItem, UserMeal } from "../../types/interfaces";
import { usePathname } from "expo-router";
import { getUsersMeals } from '../../firebase/funcs/getUsersMeals'

export default function Home() {
  const [meals, setMeals] = useState<UserMeal[]>([]);
  
  const path = usePathname();

  useEffect(() => {
    if (path === "/") {
      getUsersMeals().then(fetchedMeals => {
        console.log(fetchedMeals)
        setMeals(fetchedMeals)
      }).catch(error => {
        console.error("Error:", error);
      });
    } 
  }, [path])

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Home", headerShown: false }} />
      <Text style={styles.title}>Nutri tracker</Text>
      <View style={{ gap: 20 }}>
        <Text style={styles.text}>Profile data</Text>
        <Text style={styles.text}>Score/streak</Text>
        <Text style={styles.text}>Nutrition data</Text>
      </View>
      <FlatList
      data={meals}
      keyExtractor={(item: UserMeal) => item.id}
      renderItem={({ item }) => (
        <View style={styles.meal}>
          <Text style={styles.text}>Date: {item.date.toString()}</Text>
          <FlatList
            data={item.meals}
            keyExtractor={(item: MealItem, index: number) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.meal}>
                <Text style={styles.text}>Name: {item.product_name}</Text>
                <Text style={styles.text}>Carbs: {item.carbohydrates_value}</Text>
                <Text style={styles.text}>Protein: {item.proteins_value}</Text>
                <Text style={styles.text}>Fats: {item.fat_value}</Text>
                <Text style={styles.text}>Amount: {item.amount}</Text>
              </View>
            )}
          />
        </View>
      )}
    />
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
  meal: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: 'white'
  },
});