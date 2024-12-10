import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { Link, Stack, useRouter } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useEffect, useRef } from "react";
import Overlay from "../../pageFiles/newMeal/components/Overlay";
import fetchProductData from "../../pageFiles/newMeal/helpers/fetchproductdata";
import { useMealContext } from "../../contexts/MealContext";
import { MealItem } from "@/types/interfaces";

export default function HomeScreen() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const { addMeal } = useMealContext(); // Access the addMeal function from context
  const router = useRouter(); // Access the router for navigation

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      setTimeout(async () => {
        try {
          const productData = await fetchProductData(data); // Fetch product details based on barcode

          const newMeal : MealItem {
            
          }

          /* addMeal(newMeal); */

          router.navigate("/newMeal");
        } catch (error) {
          console.error("Error fetching product data:", error);
        } finally {
          qrLock.current = false; // Reset the lock
        }
      }, 500);
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned} // Use the handler
      />
      <Overlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: "center",
    backgroundColor: "black"
  }
})