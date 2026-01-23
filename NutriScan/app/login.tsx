import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Images } from "../src/constants/images";
import { styles } from "../src/styles/login";
import { login } from "../services/auth-api";

import { KeyboardToastWrapper, showError, showSuccess } from "@/src/helper/keyboardToast";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Dismiss keyboard immediately
    Keyboard.dismiss();

    if (!email || !password) {
      showError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Attempting login...");

      const data = await login(email.trim(), password.trim());

      if (data.success) {
        // Store token
        await AsyncStorage.setItem("accessToken", data.accessToken);

        // Store user data if available
        if (data.user) {
          await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        }

        console.log("✅ Login successful, token stored");
        showSuccess("Logged in successfully");

        // Navigate to home
        router.replace("./signup/home");
      } else {
        console.log("❌ Login failed:", data.message);
        showError(data.message || "Login failed");
      }

    } catch (error: any) {
      console.error("❌ Login error:", error);

      // Check error structure
      if (error.message === "Invalid email or password" ||
        error.message?.includes("Invalid")) {
        showError("Invalid email or password");
      } else if (error.isNetworkError) {
        showError("Network error. Please check your connection");
      } else {
        showError(error.message || "Something went wrong. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardToastWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>

        <Text style={styles.subtitle}>
          {"Don't have an account? "}
          <Text
            style={[styles.linkText, { textDecorationLine: "underline" }]}
            onPress={() => router.push("./signup")}
          >
            Signup Here
          </Text>
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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setSecure(!secure)}
            disabled={loading}
          >
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={[styles.googleButton, loading && { opacity: 0.5 }]}
          disabled={loading}
        >
          <Image source={Images.google} style={styles.googleIcon} />
          <Text style={styles.googleText}>
            Sign In with Google
          </Text>
        </TouchableOpacity>

        {/* Forgot password link */}
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => router.push("./forgot-password")}
        >
          <Text style={{ color: '#007AFF', fontSize: 14 }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardToastWrapper>
  );
}