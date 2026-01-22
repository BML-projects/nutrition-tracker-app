// app/reset-password.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { styles } from "../src/styles/login";
import { resetPassword } from "@/services/auth-api";
import { showError, showSuccess } from "@/src/helper/toast";
import { KeyboardToastWrapper } from "@/src/helper/keyboardToast";

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const otp = params.otp as string;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[@$!%*?&#]/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&#)";
    }
    return null;
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Resetting password...");

      const response = await resetPassword(email, otp, newPassword);

      if (response.success) {
        console.log("✅ Password reset successfully");
        showSuccess("Password reset successfully");

        // Navigate to login after 1 second
        setTimeout(() => {
          router.replace("/login");
        }, 1000);
      } else {
        showError(response.message || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("❌ Reset password error:", error);
      showError(error.message || "Failed to reset password. Please try again.");
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
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Reset Password</Text>

        <Text style={[styles.subtitle, { marginBottom: 30 }]}>
          Create a new password for your account
        </Text>

        {/* New Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter new password"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secureNew}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setSecureNew(!secureNew)}
            disabled={loading}
          >
            <Ionicons
              name={secureNew ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureConfirm}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setSecureConfirm(!secureConfirm)}
            disabled={loading}
          >
            <Ionicons
              name={secureConfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Password Requirements */}
        <View style={{ marginBottom: 20, paddingHorizontal: 5 }}>
          <Text style={{ fontSize: 12, color: "#666", marginBottom: 5 }}>
            Password must contain:
          </Text>
          <Text style={{ fontSize: 11, color: "#666" }}>
            • At least 8 characters{"\n"}
            • One uppercase letter{"\n"}
            • One lowercase letter{"\n"}
            • One number{"\n"}
            • One special character (@$!%*?&#)
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleResetPassword}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardToastWrapper>
  );
}