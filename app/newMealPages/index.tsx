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
import { useEffect, useRef, useState } from "react";
import Overlay from "../../pageFiles/newMeal/components/Overlay";
import fetchProductData from "../../pageFiles/newMeal/helpers/fetchproductdata";
import { useMealContext } from "../../contexts/MealContext";
import { MealItem } from "@/types/interfaces";

export default function HomeScreen() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const { setMealItem } = useMealContext(); 
  const router = useRouter(); 
  const [isScanning, setIsScanning] = useState(false); // Optional: Track scanning state

  useEffect(() => {
    //Prevent the app to scan codes in the background
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
    if (data && !qrLock.current && !isScanning) {
      qrLock.current = true; // Lock to prevent multiple scans
      setIsScanning(true);
      try {
        const productData = await fetchProductData(data);

        if (productData?.product && productData?.product.nutriments) {
          const nutriments = productData.product.nutriments;

          // Map API response to a MealItem
          const mealItem: MealItem = {
            product_name: productData.product.product_name || "Unknown Product",
            carbohydrates_value: nutriments.carbohydrates_value || 0,
            proteins_value: nutriments.proteins_value || 0,
            fat_value: nutriments.fat_value || 0,
            "energy-kcal": nutriments["energy-kcal"] || 0,
            amount: 0
          };

          console.log("Mapped MealItem:", mealItem);
          setMealItem(mealItem);
          router.push("/newMeal");
        } else {
          console.error("Product data or nutriments missing");
          setIsScanning(false);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setIsScanning(false);
      } finally {
        qrLock.current = false; // Reset the lock after the operation completes
      }
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