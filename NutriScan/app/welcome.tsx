import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSignup } from "../src/context/SignupContext";

export default function Welcome() {
  const router = useRouter();
  const { data, reset } = useSignup();

  const handleLogout = () => {
    reset();            // reset user signup data
    router.replace("/login"); // go back to login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {data.fullName || "User"}!</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
