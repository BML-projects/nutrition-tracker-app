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
    if (!goal) return;

    try {
      // Save goal to context
      setData({ goal });

      const payload = {
        ...data,
        goal,
        height: Number(data.height),
        weight: Number(data.weight),
      };

      console.log("FINAL PAYLOAD:", payload);
      
      if (!data.email || !data.password || !data.gender || !data.dob || !data.height || !data.weight) {
        Alert.alert("Error", "Incomplete signup data");
        return;
      }

      console.log('🚀 Sending signup request...');
      const res = await API.post("/auth/signup", payload);

      console.log('✅ Signup response:', res.data);

      if (res.status === 201 && res.data) {
        // ✅ CRITICAL: Save the access token
        if (res.data.accessToken) {
          await AsyncStorage.setItem('accessToken', res.data.accessToken);
          console.log('✅ Access token saved to AsyncStorage');
        } else {
          console.warn('⚠️ No accessToken in response');
        }

        // ✅ Save user data if available
        if (res.data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(res.data.user));
          console.log('✅ User data saved to AsyncStorage');
        }

        // Show success message
        Alert.alert(
          "Success!", 
          "Your account has been created successfully.",
          [
            {
              text: "OK",
              onPress: () => router.replace("./home")
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      
      if (error.response?.data?.errors) {
        Alert.alert("Signup Error", error.response.data.errors.join("\n"));
      } else if (error.response?.data?.message) {
        Alert.alert("Signup Error", error.response.data.message);
      } else if (error.message?.includes('timeout')) {
        Alert.alert("Signup Error", "Request timed out. Please try again.");
      } else {
        Alert.alert("Signup Error", error.message || "Something went wrong. Try again.");
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