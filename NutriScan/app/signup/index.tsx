import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { useSignup } from "../../src/context/SignupContext";
import { styles } from "../../src/styles/signup";
import { checkEmailExists } from "@/services/auth-api";
import { KeyboardAwareContainer } from "@/src/components/KeyboardAwareContainer";

export default function Signup() {
  const router = useRouter();
  const { data, setData } = useSignup();

  // Refs for input navigation
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    Keyboard.dismiss();

    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");

    let hasError = false;

    // Validation
    if (!data.fullName?.trim()) {
      setNameError("Full name is required");
      hasError = true;
    }

    if (!data.email?.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(data.email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!data.password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (data.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (!data.confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (data.password !== data.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      console.log('🔍 Checking email availability...');
      const response = await checkEmailExists(data.email);

      if (response.success && !response.exists) {
        console.log('✅ Email is available, proceeding...');
        router.push("./signup/dob");
      } else if (response.exists) {
        setEmailError("This email is already registered");
      }
    } catch (error: any) {
      console.error('❌ Email check error:', error);

      if (error.response?.status === 409) {
        setEmailError("This email is already registered");
      } else if (error.response?.status === 400) {
        setEmailError(error.response.data?.message || "Invalid email");
      } else if (error.message?.includes('timeout')) {
        setGeneralError("Connection timeout. Please check your internet.");
      } else {
        setGeneralError(error.response?.data?.message || "Unable to verify email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareContainer enableScroll={true}>
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
            <Ionicons name="person-add" size={40} color="#000" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          
          {/* Full Name */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <View
              style={[
                styles.inputContainer,
                nameFocused && styles.inputContainerFocused,
                nameError && styles.inputContainerError,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={nameError ? "#FF3B30" : nameFocused ? "#000" : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={data.fullName || ""}
                onChangeText={(text) => {
                  setData({ ...data, fullName: text });
                  if (nameError) setNameError("");
                  if (generalError) setGeneralError("");
                }}
                editable={!loading}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => emailRef.current?.focus()}
                autoCorrect={false}
                autoComplete="off"
                autoCapitalize="words"
              />
            </View>
            {nameError && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{nameError}</Text>
              </View>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputContainer,
                emailFocused && styles.inputContainerFocused,
                emailError && styles.inputContainerError,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={22}
                color={emailError ? "#FF3B30" : emailFocused ? "#000" : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={data.email || ""}
                onChangeText={(text) => {
                  setData({ ...data, email: text });
                  if (emailError) setEmailError("");
                  if (generalError) setGeneralError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
                autoCorrect={false}
                autoComplete="off"
              />
            </View>
            {emailError && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{emailError}</Text>
              </View>
            )}
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                passwordFocused && styles.inputContainerFocused,
                passwordError && styles.inputContainerError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={passwordError ? "#FF3B30" : passwordFocused ? "#000" : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={data.password || ""}
                onChangeText={(text) => {
                  setData({ ...data, password: text });
                  if (passwordError) setPasswordError("");
                  if (generalError) setGeneralError("");
                }}
                secureTextEntry={secure}
                editable={!loading}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                autoCorrect={false}
                autoComplete="off"
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
            {passwordError && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{passwordError}</Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.inputContainer,
                confirmPasswordFocused && styles.inputContainerFocused,
                confirmPasswordError && styles.inputContainerError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={confirmPasswordError ? "#FF3B30" : confirmPasswordFocused ? "#000" : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                ref={confirmPasswordRef}
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={data.confirmPassword || ""}
                onChangeText={(text) => {
                  setData({ ...data, confirmPassword: text });
                  if (confirmPasswordError) setConfirmPasswordError("");
                  if (generalError) setGeneralError("");
                }}
                secureTextEntry={secureConfirm}
                editable={!loading}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={handleNext}
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
            {confirmPasswordError && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              </View>
            )}
          </View>

          {/* General Error */}
          {generalError ? (
            <View style={styles.generalErrorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF3B30" />
              <Text style={styles.generalErrorText}>{generalError}</Text>
            </View>
          ) : null}

          {/* Next Button */}
          <TouchableOpacity
            style={[styles.nextButton, loading && styles.nextButtonDisabled]}
            onPress={handleNext}
            activeOpacity={0.9}
            disabled={loading}
          >
<LinearGradient
  colors={loading ? ['#d0d0d0', '#b0b0b0'] : ['#000', '#2a2a2a']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.gradientButton}
>
  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
    <Text style={styles.nextButtonText}>
      {loading ? "Checking..." : "Next"}
    </Text>
    <Ionicons name="arrow-forward" size={22} color="#fff" style={{ marginLeft: 8 }} />
  </View>
</LinearGradient>

          </TouchableOpacity>

        </View>

      </View>
    </KeyboardAwareContainer>
  );
}