import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from "react-native";
import { useRouter } from "expo-router";

import { commonStyles } from "../styles/commonStyles";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const router = useRouter();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={commonStyles.title}>Welcome Back!</Text>
        <Text style={commonStyles.subtitle}>Login to continue using NutriScan</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          style={commonStyles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          style={commonStyles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={commonStyles.button} onPress={() => alert("Login clicked")}>
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
          <TouchableOpacity onPress={() => alert("Forgot Password")}>
            <Text style={{ color: "#38BDF8", fontWeight: "bold" }}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/signup/step1")}>
            <Text style={{ color:  "#38BDF8", fontWeight: "bold" }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
