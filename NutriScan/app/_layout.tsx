// app/_layout.tsx
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
      <Toast />
    </>
  );
}
