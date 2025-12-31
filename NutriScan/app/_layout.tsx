// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { SignupProvider } from "../src/context/SignupContext";
import Toast from "react-native-toast-message";


export default function RootLayout() {
  return (
    <SignupProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
<Toast />

    </SignupProvider>
  );
}