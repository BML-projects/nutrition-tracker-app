import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Images } from "../src/constants/images";
import { styles } from "../src/styles/login";
import { login } from "../services/auth-api";



export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      // ✅ Save token
      await AsyncStorage.setItem("accessToken", data.accessToken);

      // ✅ Navigate after login
      router.replace("./home"); // change to your screen

    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
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

      {/* routing to home only for testing */}
      <TouchableOpacity style={styles.googleButton}>
        <Image source={Images.google} style={styles.googleIcon} />
        <Text style={styles.googleText} onPress={() => router.push("./signup/home")}>Sign Up with Google</Text>
      </TouchableOpacity>
    </View>
  );
}