import { StyleSheet, SafeAreaView, Text, View, Pressable, FlatList } from 'react-native';

import { Nutrients, UserPlan } from '@/types/interfaces';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from "expo-router";
import { getCurrentPlanId } from '@/firebase/funcs/getCurrentPlanId';
import { getUsersPlans } from '@/firebase/funcs/getUserPlans';

export default function TabTwoScreen() {

  const [usersPlans, setUsersPlans] = useState<UserPlan[]>([])

  const [currentPlanId, setCurrentPlanId] = useState<string | null>()

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
      getCurrentPlanId().then(fetchedId => {
        setCurrentPlanId(fetchedId)
      }).catch(error => {
        console.error("Error:", error);
      });
    } 
  }, [path])

  const renderPlanItem = ({ item }: { item: UserPlan }) => (
    <View style={styles.planItem}>
      <Text style={styles.planTitle}>Plan ID: {item.id}</Text>
      <Text>Goal: {item.planData.goal}</Text>
      <Text>Intensity: {item.planData.intensity}</Text>
      <Text>Daily Calories: {item.dailyNutrients?.["energy-kcal"]} kcal</Text>
    </View>
  )

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
      <FlatList
        data={usersPlans}
        keyExtractor={(item) => item.id}
        renderItem={renderPlanItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No plans available</Text>}
      />
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
  listContainer: {
    padding: 16,
  },
  planItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});
