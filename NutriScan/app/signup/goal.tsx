import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignup } from "../../src/context/SignupContext";
import { styles } from "../../src/styles/goal";
import API from "@/services/auth-api";

export default function GoalScreen() {
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { data, setData } = useSignup();

  const isButtonDisabled = goal === null || loading;

  const handleSignup = async () => {
    if (!goal) {
      setError("Please select your goal");
      return;
    }

    setData({ goal });

    // Validate required fields
    if (
      !data.fullName ||
      !data.email ||
      !data.password ||
      !data.gender ||
      !data.dob ||
      !data.height ||
      !data.weight
    ) {
      setError("Please fill all required fields");
      return;
    }

    const payload = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      confirmPassword: data.password,
      gender: data.gender,
      dob: new Date(data.dob).toISOString(),
      height: Number(data.height),
      weight: Number(data.weight),
      goal: goal,
    };

    try {
      setLoading(true);
      setError("");
      
      const res = await API.post("/auth/signup", payload);

      if (res.data.accessToken) {
        await AsyncStorage.setItem("accessToken", res.data.accessToken);
      }

      if (res.data.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
      }

      router.replace("./home");
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);

      setError(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const goalOptions = [
    { 
      value: "lose", 
      label: "Lose Weight", 
      icon: "trending-down",
      description: "Reduce body weight with a calorie deficit plan"
    },
    { 
      value: "maintain", 
      label: "Maintain Weight", 
      icon: "remove",
      description: "Keep your current weight steady"
    },
    { 
      value: "gain", 
      label: "Gain Weight", 
      icon: "trending-up",
      description: "Build muscle and increase body mass"
    },
  ];

  return (
    <View style={styles.container}>

          {/* Back Button */}
                              <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                                disabled={loading}
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
                goal === option.value && styles.iconWrapperActive
              ]}>
                <Ionicons 
                  name={option.icon as any} 
                  size={28} 
                  color={goal === option.value ? "#fff" : "#000"} 
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

      {/* Sign Up Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.signupButton,
            isButtonDisabled && styles.signupButtonDisabled
          ]}
          onPress={handleSignup}
          activeOpacity={0.9}
          disabled={isButtonDisabled}
        >
          <LinearGradient
            colors={isButtonDisabled ? ['#d0d0d0', '#b0b0b0'] : ['#000', '#2a2a2a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.signupButtonText}>Creating account</Text>
                <View style={styles.dots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            ) : (
              <>
                <Text style={[
                  styles.signupButtonText,
                  isButtonDisabled && styles.signupButtonTextDisabled
                ]}>
                  Sign Up
                </Text>
                <Ionicons 
                  name="checkmark-circle" 
                  size={22} 
                  color={isButtonDisabled ? "#999" : "#fff"} 
                />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}