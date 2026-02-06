import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignup } from "../../src/context/SignupContext";
import { styles } from "../../src/styles/goal";
import API from "@/services/auth-api";

export default function GoalScreen() {
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain" | null>(null);

  const router = useRouter();
  const { data, setData } = useSignup();

  const isButtonDisabled = goal === null;

  const handleSignup = async () => {
    if (!goal) {
      Alert.alert("Error", "Please select your goal");
      return;
    }

    // ✅ store selected goal into context
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
      Alert.alert("Error", "Please fill all required fields");
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
      goal: goal, // ✅ use local goal state
    };

    try {
      const res = await API.post("/auth/signup", payload);

      if (res.data.accessToken) {
        await AsyncStorage.setItem("accessToken", res.data.accessToken);
      }

      if (res.data.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
      }

      // ✅ Navigate instantly (no alert needed)
      router.replace("./home");
    } catch (error: any) {
      console.error("Signup error full:", error.response?.data || error.message);

      Alert.alert(
        "Signup Error",
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          error.message ||
          "Something went wrong."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>What is your goal?</Text>
        <Text style={styles.subtitle}>
          {`We'll use this to create your personalized plan`}
        </Text>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setGoal("lose")}
          activeOpacity={0.7}
        >
          <View style={styles.radioOuter}>
            {goal === "lose" && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.optionText}>Lose Weight</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setGoal("maintain")}
          activeOpacity={0.7}
        >
          <View style={styles.radioOuter}>
            {goal === "maintain" && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.optionText}>Maintain</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setGoal("gain")}
          activeOpacity={0.7}
        >
          <View style={styles.radioOuter}>
            {goal === "gain" && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.optionText}>Gain Weight</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        onPress={handleSignup}
        activeOpacity={0.8}
        disabled={isButtonDisabled}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Sign Up</Text>
          <Ionicons
            name="arrow-forward"
            size={25}
            color="#fff"
            style={styles.arrow}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
