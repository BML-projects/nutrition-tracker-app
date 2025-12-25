import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
//@ts-ignore
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
// @ts-ignore
import Onboarding from "react-native-onboarding-swiper";

import { COLORS } from "../styles/colors";
import { commonStyles } from "../styles/commonStyles";
import { onboardingStyles } from "../styles/onboardingStyles";

// Animated page component
function Page({ image, title, subtitle }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.backgroundStart, COLORS.backgroundEnd]}
      style={commonStyles.center}
    >
      <Animated.Image
        source={image}
        style={[onboardingStyles.image, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[commonStyles.title, { opacity: fadeAnim }]}>{title}</Animated.Text>
      <Animated.Text style={[commonStyles.subtitle, { opacity: fadeAnim }]}>{subtitle}</Animated.Text>
    </LinearGradient>
  );
}

// Custom Next button with arrow
const NextButton = (props: any) => {
      return (
        <TouchableOpacity
          style={[onboardingStyles.buttonContainer]}
          activeOpacity={0.7}
          onPress={props.onPress} // attach the handler explicitly
        >
          <MaterialIcons name="arrow-forward" size={24} color={COLORS.white} />
        </TouchableOpacity>
      );
    };
    
    const SkipButton = (props: any) => {
      return (
        <TouchableOpacity
          style={[onboardingStyles.buttonContainer]}
          activeOpacity={0.7}
          onPress={props.onPress} // attach the handler explicitly
        >
          <Text style={{ color: COLORS.white, fontWeight: "bold" }}>Skip</Text>
        </TouchableOpacity>
      );
    };
    

export default function OnboardingScreen() {
  return (
    <Onboarding
      showSkip
      bottomBarHighlight={false}
      NextButtonComponent={NextButton}
      SkipButtonComponent={SkipButton}
      onSkip={() => router.replace("/home")}
      onDone={() => router.replace("/home")}
      DotComponent={({ selected }: { selected: boolean }) => (
        <View style={selected ? onboardingStyles.activeDot : onboardingStyles.dot} />
      )}
      pages={[
        {
          backgroundColor: "green",
          image: <Page image={require("../assets/images/first.webp")} title="Scan Your Food" subtitle="Snap a picture and let AI recognize your meal instantly." />,
        },
        {
          backgroundColor: "green",
          image: <Page image={require("../assets/images/obb2.jpg")} title="Track Calories" subtitle="Get accurate calorie and nutrition details in seconds." />,
        },
        {
          backgroundColor: "green",
          image: <Page image={require("../assets/images/obb3.jpg")} title="Eat Smarter" subtitle="Plan better meals and achieve your health goals." />,
        },
      ]}
    />
  );
}
