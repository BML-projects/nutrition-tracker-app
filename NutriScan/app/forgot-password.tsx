// app/forgot-password.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  StatusBar,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "../src/styles/forgot-password";
import { forgotPassword } from "@/services/auth-api";
import { KeyboardAwareContainer } from "@/src/components/KeyboardAwareContainer"; // ✅ Only one import needed

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    Keyboard.dismiss();

    // Reset errors
    setEmailError("");
    setGeneralError("");

    // Validation
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Sending OTP to:", email);

      const response = await forgotPassword(email.trim());

      if (response.success) {
        console.log("✅ OTP sent successfully");
        
        // Navigate to verify OTP screen with email
        router.push({
          pathname: "./verify-otp",
          params: { email: email.trim() },
        });
      } else {
        setGeneralError(response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("❌ Send OTP error:", error);
      
      if (error.isNetworkError) {
        setGeneralError("Network error. Please check your connection");
      } else {
        setGeneralError(error.message || "Failed to send OTP. Please try again.");
      }
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

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="key" size={40} color="#000" />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries! Enter your email and we'll send you a verification code to reset your password.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[
              styles.inputContainer,
              emailFocused && styles.inputContainerFocused,
              emailError && styles.inputContainerError
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={22} 
                color={emailError ? "#FF3B30" : emailFocused ? "#000" : "#999"} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                  if (generalError) setGeneralError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={handleSendOTP}
                autoComplete="off"
              />
            </View>
            {emailError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{emailError}</Text>
              </View>
            ) : null}
          </View>

          {/* General Error Message */}
          {generalError ? (
            <View style={styles.generalErrorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF3B30" />
              <Text style={styles.generalErrorText}>{generalError}</Text>
            </View>
          ) : null}

          {/* Send OTP Button */}
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendOTP}
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
                  <Text style={styles.sendButtonText}>Sending</Text>
                  <View style={styles.dots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.sendButtonText}>Send OTP</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.arrowIcon} />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View style={styles.backToLoginContainer}>
            <Text style={styles.backToLoginText}>Remember your password? </Text>
            <TouchableOpacity 
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.backToLoginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </KeyboardAwareContainer>
  );
}