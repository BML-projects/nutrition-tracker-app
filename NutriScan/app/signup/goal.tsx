import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import { useSignup } from "../../src/context/SignupContext";
import { styles } from "../../src/styles/goal";
import API from "@/services/auth-api"; // axios instance

export default function GoalScreen() {
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain" | null>(null);
  const router = useRouter();
  const { data } = useSignup(); // get all previous signup data

  const isButtonDisabled = goal === null;

  const handleSignup = async () => {
    if (!goal) return;

    try {
      // Send all collected signup data + goal
      const payload = {
        ...data,
        goal, // convert to backend enum if needed: "lose", "maintain", "gain"
      };

      const res = await API.post("/auth/signup", payload);

      if (res.status === 201) {
        // signup success, navigate to home
        router.replace("./home");
      }
    } catch (error: any) {
      // show error from backend
      if (error.response?.data?.errors) {
        Alert.alert("Signup Error", error.response.data.errors.join("\n"));
      } else if (error.response?.data?.message) {
        Alert.alert("Signup Error", error.response.data.message);
      } else {
        Alert.alert("Signup Error", "Something went wrong. Try again.");
      }
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
          <View style={styles.radioOuter}>{goal === "lose" && <View style={styles.radioInner} />}</View>
          <Text style={styles.optionText}>Lose Weight</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setGoal("maintain")}
          activeOpacity={0.7}
        >
          <View style={styles.radioOuter}>{goal === "maintain" && <View style={styles.radioInner} />}</View>
          <Text style={styles.optionText}>Maintain</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setGoal("gain")}
          activeOpacity={0.7}
        >
          <View style={styles.radioOuter}>{goal === "gain" && <View style={styles.radioInner} />}</View>
          <Text style={styles.optionText}>Gain Weight</Text>
        </TouchableOpacity>
      </View>

      {/* SIGNUP BUTTON */}
      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        onPress={handleSignup}
        activeOpacity={0.8}
        disabled={isButtonDisabled}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Sign Up</Text>
          <Ionicons name="arrow-forward" size={25} color="#fff" style={styles.arrow} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
