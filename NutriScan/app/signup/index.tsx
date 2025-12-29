import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignup } from "../../src/context/SignupContext";
import { styles } from "../../src/styles/login";

export default function Signup() {
  const router = useRouter();
  const { data, setData } = useSignup();

  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const handleNext = () => {
    if (!data.fullName || !data.email || !data.password || !data.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    router.push("/signup/dob"); // go to next screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        {"Already have an account? "}
        <Text
          style={[styles.linkText, { textDecorationLine: "underline" }]}
          onPress={() => router.push("/login")}
        >
          Login Here
        </Text>
      </Text>

      {/* FULL NAME */}
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#999"
        value={data.fullName || ""}
        onChangeText={(text) => setData({ ...data, fullName: text })}
      />

      {/* EMAIL */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={data.email || ""}
        onChangeText={(text) => setData({ ...data, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* PASSWORD */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={data.password || ""}
          onChangeText={(text) => setData({ ...data, password: text })}
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
          value={data.confirmPassword || ""}
          onChangeText={(text) => setData({ ...data, confirmPassword: text })}
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

      {/* NEXT BUTTON */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}



