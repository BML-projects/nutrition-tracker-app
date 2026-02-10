import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, StatusBar, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSignup } from "../../src/context/SignupContext";
import { styles } from "../../src/styles/goal";

export default function GoalScreen() {
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain" | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();
  const { data, setData } = useSignup();

  const isButtonDisabled = goal === null;

  const handleNext = () => {
    if (!goal) {
      setError("Please select your goal");
      return;
    }

    // Save goal to context
    setData({ goal });

    // If user selects "lose" or "gain", navigate to target weight screen
    if (goal === "lose" || goal === "gain") {
      router.push("/signup/target-weight");
    } else if (goal === "maintain") {
      // For maintain, skip target weight and go to final summary/signup
      router.push("/signup/summary");
    }
  };

  const goalOptions = [
    { 
      value: "lose", 
      label: "Lose Weight", 
      icon: "trending-down",
      description: "Reduce body weight with a calorie deficit plan",
      color: "#3b82f6"
    },
    { 
      value: "maintain", 
      label: "Maintain Weight", 
      icon: "remove",
      description: "Keep your current weight steady",
      color: "#10b981"
    },
    { 
      value: "gain", 
      label: "Gain Weight", 
      icon: "trending-up",
      description: "Build muscle and increase body mass",
      color: "#f59e0b"
    },
  ];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <View style={styles.backButtonCircle}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </View>
      </TouchableOpacity>
      
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="trophy" size={40} color="#000" />
        </View>
        <Text style={styles.title}>What is your goal?</Text>
        <Text style={styles.subtitle}>We'll use this to create your personalized plan</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {goalOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              goal === option.value && styles.optionActive
            ]}
            onPress={() => {
              setGoal(option.value as any);
              setError("");
            }}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.iconWrapper,
                goal === option.value && styles.iconWrapperActive,
                { backgroundColor: goal === option.value ? option.color : option.color + '20' }
              ]}>
                <Ionicons 
                  name={option.icon as any} 
                  size={28} 
                  color={goal === option.value ? "#fff" : option.color} 
                />
              </View>
              <View style={styles.textContent}>
                <Text style={[
                  styles.optionText,
                  goal === option.value && styles.optionTextActive
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  goal === option.value && styles.optionDescriptionActive
                ]}>
                  {option.description}
                </Text>
              </View>
            </View>
            <View style={styles.radioOuter}>
              {goal === option.value && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.signupButton,
            isButtonDisabled && styles.signupButtonDisabled
          ]}
          onPress={handleNext}
          activeOpacity={0.9}
          disabled={isButtonDisabled}
        >
          <LinearGradient
            colors={isButtonDisabled ? ['#d0d0d0', '#b0b0b0'] : ['#000', '#2a2a2a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={[
              styles.signupButtonText,
              isButtonDisabled && styles.signupButtonTextDisabled
            ]}>
              Continue
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={22} 
              color={isButtonDisabled ? "#999" : "#fff"} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}