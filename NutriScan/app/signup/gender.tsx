import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSignup } from "../../src/context/SignupContext";
import { styles } from "../../src/styles/gender";

export default function GenderScreen() {
    const router = useRouter();
    const { data, setData } = useSignup();

    // Initialize local state from context
    const [gender, setGender] = useState<"female" | "male" | "other" | null>(data.gender ?? null);

    const isButtonDisabled = gender === null;

    // Update context whenever gender changes
    useEffect(() => {
        if (gender) {
            setData({ gender });
        }
    }, [gender, setData]);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Choose your Gender</Text>
                <Text style={styles.subtitle}>
                    {`we'll use this to create your personalized plan`}
                </Text>

                {/* Female Option */}
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

                {/* Male Option */}
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

                {/* Other Option */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setGender("other")}
                    activeOpacity={0.7}
                >
                    <View style={styles.radioOuter}>
                        {gender === "other" && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionText}>Other</Text>
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
                        router.push("/signup/measurement"); // move to next screen
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
