import { Stack } from "expo-router";
import { SignupProvider } from "@/src/context/SignupContext";

export default function SignupLayout() {
  return (
    <SignupProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SignupProvider>
  );
}
