import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import AnimatedScreen from "../../components/AnimatedScreen";
import ProgressDots from "../../components/ProgressDots";
import { authStyles } from "../../styles/authStyles";
import { COLORS } from "../../styles/colors";

export default function Step3() {
  const router = useRouter();
  const [goal, setGoal] = useState<string | null>(null);

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
        <ProgressDots total={3} current={3} />

        <Text style={authStyles.title}>Your Goal</Text>
        <Text style={authStyles.subtitle}>Choose what fits you best</Text>

        {[
          { key: "gain", label: "Gain Weight" },
          { key: "loss", label: "Lose Weight" },
          { key: "maintain", label: "Maintain Weight" },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              authStyles.goalBox,
              goal === item.key && { backgroundColor: COLORS.primary },
            ]}
            onPress={() => setGoal(item.key)}
          >
            <Text
              style={[
                authStyles.genderText,
                goal === item.key && { color: COLORS.white },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Prev + Finish */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
          <TouchableOpacity
            style={[authStyles.button, { flex: 1 }]}
            onPress={() => router.back()}
          >
            <Text style={authStyles.buttonText}>Prev</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              authStyles.button,
              {
                flex: 1,
                backgroundColor: goal ? COLORS.primary : COLORS.gray,
              },
            ]}
            disabled={!goal}
            onPress={() => router.replace("/home")}
          >
            <Text style={authStyles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </AnimatedScreen>
  );
}
