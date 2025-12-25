import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
// @ts-ignore
import Onboarding from "react-native-onboarding-swiper";

import { COLORS } from "../styles/colors";
import { onboardingStyles } from "../styles/onboardingStyles";

// Next Button
const NextButton = (props: any) => (
  <TouchableOpacity
    style={onboardingStyles.buttonContainer}
    onPress={() => {
      console.log("Next button clicked");
      console.log("props:", props);
      props.onPress && props.onPress(); // VERY IMPORTANT
    }}
  >
    <MaterialIcons name="arrow-forward" size={24} color={COLORS.white} />
  </TouchableOpacity>

);

// Skip Button
const SkipButton = (props: any) => (
  <TouchableOpacity
    style={onboardingStyles.buttonContainer}
    onPress={props.onPress}
    activeOpacity={0.7}
  >
    <Text style={{ color: COLORS.white, fontWeight: "700" }}>Skip</Text>
  </TouchableOpacity>
);

// Dot Component
const Dot = ({ selected }: { selected: boolean }) => (
  <View
    style={{
      width: selected ? 12 : 8,
      height: selected ? 12 : 8,
      borderRadius: 6,
      marginHorizontal: 4,
      backgroundColor: selected ? COLORS.primary : "#888",
    }}
  />
);

// Animated page wrapper
function AnimatedPage({ source, title, subtitle }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={[COLORS.background, COLORS.card]} style={styles.center}>
      <Animated.Image
        source={source}
        style={[onboardingStyles.image, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>{title}</Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>{subtitle}</Animated.Text>
    </LinearGradient>
  );
}

export default function OnboardingScreen() {
  const pages = [
    {
      image: require("../assets/images/scan.png"),
      title: "Scan Your Food",
      subtitle: "Snap a picture and let AI recognize your meal instantly.",
    },
    {
      image: require("../assets/images/scan.png"),
      title: "Track Calories",
      subtitle: "Get accurate calorie and nutrition details in seconds.",
    },
    {
      image: require("../assets/images/scan.png"),
      title: "Eat Smarter",
      subtitle: "Plan better meals and achieve your health goals.",
    },
  ];

  return (
    <Onboarding
      showSkip
      bottomBarHighlight={false}
      NextButtonComponent={NextButton}
      SkipButtonComponent={SkipButton}
      DotComponent={Dot}
      onSkip={() => router.replace("/login")}
      onDone={() => router.replace("/login")}
      pages={pages.map((p) => ({
        backgroundColor: COLORS.background,
        image: <AnimatedPage source={p.image} title={p.title} subtitle={p.subtitle} />,
      }))}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
    marginTop: 12,
  },
});
