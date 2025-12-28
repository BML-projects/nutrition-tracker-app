import { useRouter } from "expo-router";
import React from "react";
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { Images } from "../constants/images";
import { styles } from "../styles/onboarding";

export default function OnboardingScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ImageBackground
                source={Images.food}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.card}>
                <Text style={styles.title}>Easy Calorie Tracking</Text>

                <Text style={styles.subtitle}>
                    Just snap a quick photo of your meal and we will do the rest.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace("./login")}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Next</Text>
                    <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
