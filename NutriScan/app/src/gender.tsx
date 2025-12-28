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

    const isButtonDisabled = gender === null;

    return (
        <View style={styles.container}>

            <View>
                <Text style={styles.title}>Choose your Gender</Text>
                <Text style={styles.subtitle}>
                    we'll use this to create your personalized plan
                </Text>


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


            <TouchableOpacity
                style={[
                    styles.button,
                    isButtonDisabled && styles.buttonDisabled, // optional: change style when disabled
                ]}
                onPress={() => {
                    if (!isButtonDisabled) {
                        router.push("./nextScreen");
                    }
                }}
                activeOpacity={0.8}
                disabled={isButtonDisabled} // disable the button if no gender selected
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
