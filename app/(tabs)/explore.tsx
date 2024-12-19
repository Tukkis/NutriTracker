import { StyleSheet, SafeAreaView, Text, View, Pressable } from 'react-native';

import { Nutrients, UserPlan } from '@/types/interfaces';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from "expo-router";
import { getUsersMeals } from '@/firebase/funcs/getUsersMeals';
import { getUsersPlans } from '@/firebase/funcs/getUserPlans';

export default function TabTwoScreen() {

  const [usersPlans, setUsersPlans] = useState<UserPlan[]>([])

  const [todaysNutrients, setTodaysNutrients] = useState<Nutrients>({
    "energy-kcal": 0,
    carbohydrates_value: 0,
    proteins_value: 0,
    fat_value: 0
  })

  const path = usePathname();

  const router = useRouter();

  const handleNavigation = () => {
    router.navigate('/planPages/addPlan')
  };
  
    useEffect(() => {
      if (path === "/explore") {
        getUsersPlans().then(fetchedPlans => {
          console.log(fetchedPlans)
          setUsersPlans(fetchedPlans)
        }).catch(error => {
          console.error("Error:", error);
        });
        getUsersMeals(new Date()).then(fetchedMeals => {
          const allMeals = fetchedMeals.flatMap(mealData => mealData.meals);

          // Calculate total nutrients based on meal amount
          const totalNutrients = allMeals.reduce((acc, meal) => {
            const portionFactor = meal.amount / 100; // Convert to the nutrient for the portion size
  
            // Sum the nutrients, multiplying by the portion factor
            acc["energy-kcal"] += (meal["energy-kcal"] || 0) * portionFactor;
            acc.carbohydrates_value += (meal.carbohydrates_value || 0) * portionFactor;
            acc.proteins_value += (meal.proteins_value || 0) * portionFactor;
            acc.fat_value += (meal.fat_value || 0) * portionFactor;
  
            return acc;
          }, {
            "energy-kcal": 0,
            carbohydrates_value: 0,
            proteins_value: 0,
            fat_value: 0
          });
  
          // Update state with the total nutrients
          console.log(totalNutrients)
          setTodaysNutrients(totalNutrients);
        }).catch(error => {
          console.error("Error:", error);
        });
      } 
    }, [path])
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 20 }}>
        <Text style={styles.text}>Profile data</Text>
        <Text style={styles.text}></Text>
        <Text style={styles.text}></Text>
      </View>
      <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={(handleNavigation)} 
      >
        <Text style={styles.buttonText}>add Plan</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: 'white'
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "#0056b3",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
