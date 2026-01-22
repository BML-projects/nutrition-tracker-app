// app/verify-otp.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { styles } from "../src/styles/login";
import { verifyOTP, forgotPassword } from "@/services/auth-api";
import { showError, showSuccess } from "@/src/helper/toast";
import { KeyboardToastWrapper } from "@/src/helper/keyboardToast";

export default function VerifyOTP() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      showError("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Verifying OTP...");

      const response = await verifyOTP(email, otpString);

      if (response.success) {
        console.log("✅ OTP verified successfully");
        showSuccess("OTP verified successfully");

        // Navigate to reset password screen
        router.push({
          pathname: "./reset-password",
          params: { email, otp: otpString },
        });
      } else {
        showError(response.message || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error("❌ Verify OTP error:", error);
      showError(error.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResending(true);
      console.log("🔄 Resending OTP...");

      const response = await forgotPassword(email);

      if (response.success) {
        showSuccess("OTP resent to your email");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        showError(response.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error("❌ Resend OTP error:", error);
      showError(error.message || "Failed to resend OTP");
    } finally {
      setResending(false);
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

        <Text style={styles.title}>Verify OTP</Text>

        <Text style={[styles.subtitle, { marginBottom: 40 }]}>
          Enter the 6-digit code sent to {"\n"}
          <Text style={{ fontWeight: "600" }}>{email}</Text>
        </Text>

        {/* OTP Input */}
        <View style={otpStyles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={otpStyles.otpInput}
              value={digit}
              onChangeText={(value) => handleOTPChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!loading && !resending}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.loginButton, (loading || resending) && { opacity: 0.7 }]}
          onPress={handleVerifyOTP}
          activeOpacity={0.8}
          disabled={loading || resending}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={handleResendOTP}
          disabled={loading || resending}
        >
          <Text style={{ color: "#007AFF", fontSize: 14 }}>
            {resending ? "Resending..." : "Resend OTP"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardToastWrapper>
  );
}

const otpStyles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    backgroundColor: "#F8F8F8",
  },
});