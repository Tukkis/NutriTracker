import React, { useEffect, useState } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { PlanProvider } from "@/contexts/PlanContext";
import { MealProvider } from "../contexts/MealContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firestore";
import Login from "./login"; 
import Register from "./register"; // Import the Register screen
import { DailyLogProvider } from "@/contexts/LogContext";
import { ChallengeProvider } from "@/contexts/ChallengeContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (!loaded || isAuthenticated === null) {
    // Wait for fonts to load and authentication state to initialize
    return null;
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onToggleRegister={() => setShowRegister(false)} />
    ) : (
      <Login onToggleRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <MealProvider>
      <PlanProvider>
        <DailyLogProvider>
          <ChallengeProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <Stack  screenOptions={{
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="newMealPages/codeReader" options={{ headerShown: false }} />
                <Stack.Screen name="newMealPages/editMeal" options={{ headerShown: false }} />
                <Stack.Screen name="planPages/addPlan" options={{ headerShown: false }} />
                <Stack.Screen name="planPages/editPlan" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </ChallengeProvider>
        </DailyLogProvider>
      </PlanProvider>
    </MealProvider>
  );
}
