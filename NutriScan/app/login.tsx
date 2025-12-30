import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Images } from "../src/constants/images";
import { styles } from "../src/styles/login";
import { useSignup } from "../src/context/SignupContext"; // context
import { login } from '../services/auth-api' // your axios login
import API from "../services/test";

export default function Login() {
  const router = useRouter();
  const { setData } = useSignup(); // set user data in context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password); // call API
      // Suppose API returns { accessToken, fullName, email, ... }
      
      // Save user info in context
      setData({
        fullName: res.fullName || "User",
        email: res.email,
      });

      // Navigate to welcome page
      router.replace("./welcome");
    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const testApi = async () => {
  try {
    const res = await API.get("/");
    console.log("Response:", res.data);
    alert(res.data.message);
  } catch (error: any) {
    console.log("CORS / API Error:", error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        {"Don't have an account? "}
        <Text
          style={[styles.linkText, { textDecorationLine: "underline" }]}
          onPress={() => router.push("/signup")}
        >
          Signup Here
        </Text>
      </Text>

      {/* EMAIL */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* PASSWORD */}
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

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={testApi}
      >
        <Text style={styles.loginButtonText}>Test Backend</Text>
      </TouchableOpacity>

      {/* GOOGLE LOGIN */}
      <TouchableOpacity style={styles.googleButton}>
        <Image source={Images.google} style={styles.googleIcon} />
        <Text style={styles.googleText}>Sign Up with Google</Text>
      </TouchableOpacity>
    </View>
    
  );
}
