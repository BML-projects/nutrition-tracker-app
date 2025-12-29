// app/signup/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function SignupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="dob" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="measurement" />
      <Stack.Screen name="layout" />
    </Stack>
  );
}