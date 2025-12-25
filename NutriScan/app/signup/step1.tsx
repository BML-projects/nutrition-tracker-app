import { View, Text, TextInput, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { authStyles } from "../../styles/authStyles";
import ProgressDots from "../../components/ProgressDots";
import AnimatedScreen from "../../components/AnimatedScreen";

export default function Step1() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
      <AnimatedScreen>
    <Animated.View
      style={[
        authStyles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <ProgressDots total={3} current={1} />

      <Text style={authStyles.title}>Create Account</Text>
      <Text style={authStyles.subtitle}>Tell us who you are</Text>

      <View style={authStyles.inputContainer}>
        <TextInput placeholder="Full Name" style={authStyles.input} />
        <TextInput placeholder="Email" style={authStyles.input} />
      </View>

      <TouchableOpacity
        style={authStyles.button}
        onPress={() => router.push("/signup/step2")}
      >
        <Text style={authStyles.buttonText}>Next</Text>
      </TouchableOpacity>
    </Animated.View>
    </AnimatedScreen>
  );
}
