import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../styles/gender";

export default function GenderScreen() {
    const [gender, setGender] = useState<"female" | "male" | null>(null);
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* TOP CONTENT */}
            <View>
                <Text style={styles.title}>Choose your Gender</Text>
                <Text style={styles.subtitle}>
                    we'll use this to create your personalized plan
                </Text>

                {/* FEMALE */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setGender("female")}
                    activeOpacity={0.7}
                >
                    <View style={styles.radioOuter}>
                        {gender === "female" && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionText}>Female</Text>
                </TouchableOpacity>

                {/* MALE */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setGender("male")}
                    activeOpacity={0.7}
                >
                    <View style={styles.radioOuter}>
                        {gender === "male" && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionText}>Male</Text>
                </TouchableOpacity>
            </View>

            {/* BOTTOM BUTTON */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("./nextScreen")}
                activeOpacity={0.8}
            >
                <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Next</Text>
                    <Ionicons
                        name="arrow-forward"
                        size={25}
                        color="#fff"
                        style={styles.arrow}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}
