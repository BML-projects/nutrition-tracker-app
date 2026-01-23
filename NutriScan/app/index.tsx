import { router } from "expo-router"; // <-- import router
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { splashStyles as styles } from "../styles/splashStyles";

export default function Splash() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    SplashScreen.hideAsync();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace("/onboarding"); // <-- go to onboarding
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  console.log("Splash Screen Rendered");
  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/images/logo.png")}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        NutriScan
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Eat Smart. Live Strong.
      </Animated.Text>
    </View>
  );
}
