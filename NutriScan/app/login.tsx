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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';

import { styles } from "../src/styles/login";
import { login } from "../services/auth-api";
import { KeyboardToastWrapper } from "@/src/helper/keyboardToast";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    // Validation
    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      console.log("🔄 Attempting login...");

      const data = await login(email.trim(), password.trim());

      if (data.success) {
        await AsyncStorage.setItem("accessToken", data.accessToken);

        if (data.user) {
          await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        }

        console.log("✅ Login successful, token stored");

        router.replace("./signup/home");
      } else {
        console.log("❌ Login failed:", data.message);
        setGeneralError(data.message || "Login failed");
      }

    } catch (error: any) {
      console.error("❌ Login error:", error);

      if (error.message === "Invalid email or password" ||
        error.message?.includes("Invalid")) {
        setGeneralError("Invalid email or password");
      } else if (error.isNetworkError) {
        setGeneralError("Network error. Please check your connection");
      } else {
        setGeneralError(error.message || "Something went wrong. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardToastWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={40} color="#000" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
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
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoComplete="off"
                textContentType="none"
              />
            </View>
            {emailError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{emailError}</Text>
              </View>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputContainer,
              passwordFocused && styles.inputContainerFocused,
              passwordError && styles.inputContainerError
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={22} 
                color={passwordError ? "#FF3B30" : passwordFocused ? "#000" : "#999"} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError("");
                }}
                secureTextEntry={secure}
                editable={!loading}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                autoComplete="off"
                textContentType="none"
              />
              <TouchableOpacity
                onPress={() => setSecure(!secure)}
                disabled={loading}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={passwordError ? "#FF3B30" : passwordFocused ? "#000" : "#999"}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{passwordError}</Text>
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

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("./forgot-password")}
          >
            <Text style={styles.forgotPasswordText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
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
                  <Text style={styles.loginButtonText}>Logging in</Text>
                  <View style={styles.dots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

        {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("./signup")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </KeyboardToastWrapper>
  );
}