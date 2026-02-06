// app/reset-password.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Keyboard,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "../src/styles/login";
import { resetPassword } from "@/services/auth-api";
import { KeyboardAwareContainer } from "@/src/components/KeyboardAwareContainer";
import { showError, showSuccess } from "@/src/helper/keyboardToast"; // ✅ Fixed import

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const otp = params.otp as string;

  const confirmPasswordRef = useRef<TextInput>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Focus states
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Error states
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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
    Keyboard.dismiss();

    // Reset errors
    setNewPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!newPassword) {
      setNewPasswordError("Password is required");
      hasError = true;
    } else {
      const validationError = validatePassword(newPassword);
      if (validationError) {
        setNewPasswordError(validationError);
        hasError = true;
      }
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      console.log("🔄 Resetting password...");

      const response = await resetPassword(email, otp, newPassword);

      if (response.success) {
        console.log("✅ Password reset successfully");
        showSuccess("Password reset successfully");

        // Navigate to login after 1.5 seconds
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
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
    <KeyboardAwareContainer enableScroll={false}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={40} color="#000" />
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Create a new password for your account</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          
          {/* New Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>New Password</Text>
            <View style={[
              styles.inputContainer,
              newPasswordFocused && styles.inputContainerFocused,
              newPasswordError && styles.inputContainerError
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={22} 
                color={newPasswordError ? "#FF3B30" : newPasswordFocused ? "#000" : "#999"} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (newPasswordError) setNewPasswordError("");
                }}
                secureTextEntry={secureNew}
                editable={!loading}
                onFocus={() => setNewPasswordFocused(true)}
                onBlur={() => setNewPasswordFocused(false)}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                autoCorrect={false}
                autoComplete="off"
              />
              <TouchableOpacity
                onPress={() => setSecureNew(!secureNew)}
                disabled={loading}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={secureNew ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={newPasswordError ? "#FF3B30" : newPasswordFocused ? "#000" : "#999"}
                />
              </TouchableOpacity>
            </View>
            {newPasswordError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{newPasswordError}</Text>
              </View>
            ) : null}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[
              styles.inputContainer,
              confirmPasswordFocused && styles.inputContainerFocused,
              confirmPasswordError && styles.inputContainerError
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={22} 
                color={confirmPasswordError ? "#FF3B30" : confirmPasswordFocused ? "#000" : "#999"} 
                style={styles.inputIcon}
              />
              <TextInput
                ref={confirmPasswordRef}
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError("");
                }}
                secureTextEntry={secureConfirm}
                editable={!loading}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={handleResetPassword}
                autoCorrect={false}
                autoComplete="off"
              />
              <TouchableOpacity
                onPress={() => setSecureConfirm(!secureConfirm)}
                disabled={loading}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={secureConfirm ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={confirmPasswordError ? "#FF3B30" : confirmPasswordFocused ? "#000" : "#999"}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              </View>
            ) : null}
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <Text style={styles.requirementsText}>
              • At least 8 characters{"\n"}
              • One uppercase letter (A-Z){"\n"}
              • One lowercase letter (a-z){"\n"}
              • One number (0-9){"\n"}
              • One special character (@$!%*?&#)
            </Text>
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleResetPassword}
            activeOpacity={0.9}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#d0d0d0', '#b0b0b0'] : ['#000', '#2a2a2a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loginButtonText}>Resetting</Text>
                  <View style={styles.dots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Reset Password</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAwareContainer>
  );
}