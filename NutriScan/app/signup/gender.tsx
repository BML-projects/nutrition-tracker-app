import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSignup } from "../../src/context/SignupContext";
import { styles } from "../../src/styles/gender";

export default function GenderScreen() {
  const router = useRouter();
  const { data, setData } = useSignup();

  const [gender, setGender] = useState<"female" | "male" | "other" | null>(data.gender ?? null);

  const isButtonDisabled = gender === null;

  useEffect(() => {
    if (gender) {
      setData({ gender });
    }
  }, [gender, setData]);

  const genderOptions = [
    { value: "female", label: "Female", icon: "female" },
    { value: "male", label: "Male", icon: "male" },
    { value: "other", label: "Other", icon: "transgender" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="people" size={40} color="#000" />
        </View>
        <Text style={styles.title}>Choose your Gender</Text>
        <Text style={styles.subtitle}>We'll use this to create your personalized plan</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              gender === option.value && styles.optionActive
            ]}
            onPress={() => setGender(option.value as any)}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconWrapper}>
                <Ionicons 
                  name={option.icon as any} 
                  size={28} 
                  color={gender === option.value ? "#000" : "#999"} 
                />
              </View>
              <Text style={[
                styles.optionText,
                gender === option.value && styles.optionTextActive
              ]}>
                {option.label}
              </Text>
            </View>
            <View style={styles.radioOuter}>
              {gender === option.value && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            isButtonDisabled && styles.nextButtonDisabled
          ]}
          onPress={() => {
            if (!isButtonDisabled) {
              router.push("/signup/measurement");
            }
          }}
          activeOpacity={0.9}
          disabled={isButtonDisabled}
        >
          <LinearGradient
            colors={isButtonDisabled ? ['#d0d0d0', '#b0b0b0'] : ['#000', '#2a2a2a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={[
              styles.nextButtonText,
              isButtonDisabled && styles.nextButtonTextDisabled
            ]}>
              Next
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={22} 
              color={isButtonDisabled ? "#999" : "#fff"} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}