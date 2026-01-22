// app/forgot-password.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { styles } from "../src/styles/login";
import { forgotPassword } from "@/services/auth-api";
import { showError, showSuccess } from "@/src/helper/toast";
import { KeyboardToastWrapper } from "@/src/helper/keyboardToast";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      showError("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Sending OTP to:", email);

      const response = await forgotPassword(email.trim());

      if (response.success) {
        console.log("✅ OTP sent successfully");
        showSuccess("OTP sent to your email");
        
        // Navigate to verify OTP screen with email
        router.push({
          pathname: "./verify-otp",
          params: { email: email.trim() },
        });
      } else {
        showError(response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("❌ Send OTP error:", error);
      showError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardToastWrapper>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={{ position: "absolute", top: 50, left: 20 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Forgot Password</Text>

        <Text style={[styles.subtitle, { marginBottom: 30 }]}>
          Enter your email address and we will send you an OTP to reset your
          password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleSendOTP}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Send OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={{ color: "#007AFF", fontSize: 14 }}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardToastWrapper>
  );
}