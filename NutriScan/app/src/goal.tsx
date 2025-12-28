import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../styles/goal";

export default function GoalScreen() {
    // State for the selected goal
    const [goal, setGoal] = useState<"Lose Weight" | "Maintain" | "Gain Weight" | null>(null);
    const router = useRouter();

    const isButtonDisabled = goal === null;

    return (
        <View style={styles.container}>

            <View>
                <Text style={styles.title}>What is your goal?</Text>
                <Text style={styles.subtitle}>
                    we'll use this to create your personalized plan
                </Text>

                {/* Option 1: Lose Weight */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setGoal("Lose Weight")}
                    activeOpacity={0.7}
                >
                    <View style={styles.radioOuter}>
                        {goal === "Lose Weight" && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionText}>Lose Weight</Text>
                </TouchableOpacity>

                {/* Option 2: Maintain */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setGoal("Maintain")}
                    activeOpacity={0.7}
                >
                    <View style={styles.radioOuter}>
                        {goal === "Maintain" && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionText}>Maintain</Text>
                </TouchableOpacity>

                {/* Option 3: Gain Weight */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setGoal("Gain Weight")}
                    activeOpacity={0.7}
                >
                    <View style={styles.radioOuter}>
                        {goal === "Gain Weight" && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionText}>Gain Weight</Text>
                </TouchableOpacity>
            </View>

            {/* NEXT BUTTON */}
            <TouchableOpacity
                style={[
                    styles.button,
                    isButtonDisabled && styles.buttonDisabled,
                ]}
                onPress={() => {
                    if (!isButtonDisabled) {
                        // Navigate to next page (e.g., activity level)
                        router.push("./activitylevel");
                    }
                }}
                activeOpacity={0.8}
                disabled={isButtonDisabled}
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