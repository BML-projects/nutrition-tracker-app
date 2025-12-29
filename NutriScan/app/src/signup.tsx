import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  
} from "react-native";
import { styles } from "../styles/login"; // your styles file
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
 



export default function Signup() {
  const router = useRouter();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

 // You can define handleSignup later when ready



  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>Create Account</Text>

      {/* SUBTITLE */}
      <Text style={styles.subtitle}>
        {"Already have an account? "}
        <Text
          style={[styles.linkText, { textDecorationLine: "underline" }]}
          onPress={() => router.push("./login")}
        >
          Login Here
        </Text>
      </Text>

      {/* FULL NAME */}
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#999"
        value={fullName}
        onChangeText={setFullName}
      />

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

      {/* CONFIRM PASSWORD */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm your password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureConfirm}
        />
        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
          <Ionicons
            name={secureConfirm ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* SIGNUP BUTTON */}
      <TouchableOpacity
        style={styles.loginButton}
         onPress={() => router.replace("./gender")} 
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
