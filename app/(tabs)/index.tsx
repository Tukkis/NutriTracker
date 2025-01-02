import { View, Text, StyleSheet, SafeAreaView, Dimensions, FlatList } from "react-native";
import { Link, Stack } from "expo-router";
import * as Progress from 'react-native-progress';

import { useEffect, useState } from "react";

import { MealItem, UserMeal, DailyLog } from "../../types/interfaces";
import { usePathname } from "expo-router";
import { getUsersMeals } from '../../firebase/funcs/getUsersMeals';
import { getUserDailyLogs } from "@/firebase/funcs/getUserLogs";

const now = new Date();
const day = String(now.getDate()).padStart(2, "0");
const month = String(now.getMonth() + 1).padStart(2, "0");
const year = now.getFullYear();
const dateString = `${day}-${month}-${year}`;
const { width } = Dimensions.get('window');

export default function Home() {
  const [meals, setMeals] = useState<UserMeal[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);

  const path = usePathname();

  useEffect(() => {
    if (path === "/") {
      getUsersMeals()
        .then(fetchedMeals => {
          setMeals(fetchedMeals);
        })
        .catch(error => {
          console.error("Error:", error);
        });
      getUserDailyLogs()
        .then(fetchedLogs => {
          if (fetchedLogs) {
            setLogs(fetchedLogs);
          }
        })
        .catch(error => {
          console.error("Error fetching logs:", error);
        });
    }
  }, [path]);

  const todaysLog: DailyLog = 
  logs.find((log) => log.date === dateString) || 
  {
    date: dateString,
    totalIntake: {
      "energy-kcal": 0,
      carbohydrates_value: 0,
      proteins_value: 0,
      fat_value: 0,
    },
    dailyNutrients: {
      "energy-kcal": 0,
      carbohydrates_value: 0,
      proteins_value: 0,
      fat_value: 0,
    },
    adherence: {
      "energy-kcal": 0,
      carbohydrates_value: 0,
      proteins_value: 0,
      fat_value: 0,
    },
    plan: '',
    score: 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Home", headerShown: false }} />
      <Text style={styles.title}>Nutri tracker</Text>
      <View style={styles.current}>
        <Text style={styles.text}>Date: {todaysLog.date}</Text>
        <View style={styles.adherenceContainer}>
          <View style={styles.nutrient}>
            <Text style={styles.text}>Energy</Text>
            <Progress.Circle
              size={50}
              animated={false}
              progress={todaysLog.adherence["energy-kcal"] / 100}
              showsText={true}
              formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
              thickness={8}
              borderWidth={0}
              color="#3b82f6"
              unfilledColor="#e0e0e0"
            />
          </View>
          <View style={styles.nutrient}>
            <Text style={styles.text}>Carbs</Text>
            <Progress.Circle
              size={50}
              animated={false}
              progress={todaysLog.adherence.carbohydrates_value / 100}
              showsText={true}
              formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
              thickness={8}
              borderWidth={0}
              color="#3b82f6"
              unfilledColor="#e0e0e0"
            />
          </View>
          <View style={styles.nutrient}>
            <Text style={styles.text}>Proteins</Text>
            <Progress.Circle
              size={50}
              animated={false}
              progress={todaysLog.adherence.proteins_value / 100}
              showsText={true}
              formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
              thickness={8}
              borderWidth={0}
              color="#3b82f6"
              unfilledColor="#e0e0e0"
            />
          </View>
          <View style={styles.nutrient}>
            <Text style={styles.text}>Fats</Text>
            <Progress.Circle
              size={50}
              animated={false}
              progress={todaysLog.adherence.fat_value / 100} 
              showsText={true}
              formatText={(progress) => `${(progress * 100).toFixed(1)}%`}
              thickness={8}
              borderWidth={0}
              color="#3b82f6"
              unfilledColor="#e0e0e0"
            />
          </View>
        </View>
        <View style={styles.nutrient}>
          <Text style={styles.text}>Score</Text>
          <Progress.Bar
              width={90}
              animated={false}
              progress={todaysLog.score / 100} 
              borderWidth={0}
              color="#3b82f6"
              unfilledColor="#e0e0e0"
            />
        </View>
      </View>
      <Text style={styles.header}>Past Logs:</Text>
      <FlatList
      data={logs}
      keyExtractor={(item: DailyLog) => item.date}
      renderItem={({ item }) => (
        item.date=== dateString ? null :
        <View style={styles.log}>
          <Text style={styles.logtext}>Date: {item.date}</Text>
          <View style={styles.adherenceContainer}>
            <View style={styles.nutrient}>
              <Text style={styles.logtext}>Energy</Text>
              <Progress.Circle
                size={50}
                animated={false}
                progress={item.adherence["energy-kcal"] / 100}
                showsText={true}
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
                showsText={true}
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
                showsText={true}
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
                showsText={true}
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
  header: {
    color: "white",
    fontSize: 20,
    marginTop: 10
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
  log: {
    margin: 10,
    width: width* 0.7,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  current: {
    margin: 10,
    width: width* 0.9,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  logtext: {
    fontSize: 16,
  },
  text :{
    fontSize: 16,
    marginBottom: 4,
  },
  adherenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  nutrient: {
    alignItems: 'center',
  },
});