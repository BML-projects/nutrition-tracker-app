import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // keep native splash visible until index.tsx hides it
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
