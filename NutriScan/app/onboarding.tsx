import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../src/constants/images";
import { styles } from "../src/styles/onboarding";

export default function Onboarding() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ImageBackground source={Images.food} style={styles.image} resizeMode="cover" />
            <View style={styles.card}>
                <Text style={styles.title}>Easy Calorie Tracking</Text>
                <Text style={styles.subtitle}>
                    Just snap a quick photo of your meal and we will do the rest.
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace("/login")}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
