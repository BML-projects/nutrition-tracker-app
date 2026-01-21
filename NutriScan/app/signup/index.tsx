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
import { checkEmailExists } from "@/services/auth-api";
import {showError } from "@/src/helper/toast";
import { KeyboardToastWrapper } from "@/src/helper/keyboardToast";

export default function Signup() {
  const router = useRouter();
  const { data, setData } = useSignup();

  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

const handleNext = async () => {
  if (!data.fullName || !data.email || !data.password) {
    showError("Please fill all fields");
    return;
  }

  if (data.password !== data.confirmPassword) {
    showError("Password and confirm password do not match");
    return;
  }

  try {
    console.log('🔍 Checking email availability...');
    const response = await checkEmailExists(data.email);
    
    console.log('🔍 Email check response:', response);
    
    // If we get here, email is available
    if (response.success && !response.exists) {
      console.log('✅ Email is available, proceeding...');
      router.push("./signup/dob");
    } else if (response.exists) {
      showError("This email is already registered");
    }

  } catch (error: any) {
    console.error('❌ Email check error:', error);
    
    // Handle different error scenarios
    if (error.response?.status === 409) {
      showError("This email is already registered");
    } else if (error.response?.status === 400) {
      showError(error.response.data?.message || "Invalid email");
    } else if (error.message?.includes('timeout')) {
      showError("Connection timeout. Please check your internet.");
    } else {
      showError(error.response?.data?.message || "Unable to verify email. Please try again.");
    }
  }
};


  return (


  <KeyboardToastWrapper>    

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

  </KeyboardToastWrapper>

  
  )}
  



