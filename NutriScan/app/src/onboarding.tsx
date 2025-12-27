import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Images } from "../constants/images";
import { styles } from "../styles/onboarding";

const slides = [
    {
        title: "Effortless calorie counting",
        subtitle: "Snap a photo—AI instantly tracks your meal’s calories.",
    },
    {
        title: "Smart nutrition insights",
        subtitle: "Get macro & micronutrient breakdown instantly.",
    },
    {
        title: "Personalized diet plans",
        subtitle: "AI-powered recommendations just for you.",
    },
];

export default function OnboardingScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            {/* IMAGE FROM constants/images.ts */}
            <ImageBackground source={Images.food} style={styles.image} />

            <LinearGradient colors={["#111", "#111"]} style={styles.bottomContainer}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={styles.title}>{slides[activeIndex].title}</Text>
                    <Text style={styles.subtitle}>
                        {slides[activeIndex].subtitle}
                    </Text>
                </Animated.View>

                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>NEXT</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.loginText}>
                        Already have an account?
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}
