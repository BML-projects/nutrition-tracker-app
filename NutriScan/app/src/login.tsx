import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../styles/login";
import { Images } from "../constants/images";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secure, setSecure] = useState(true);

    return (
        <View style={styles.container}>

            {/* TITLE */}
            <Text style={styles.title}>Welcome</Text>

            {/* SUBTITLE */}
            <Text style={styles.subtitle}>
                Already have an account?{" "}
                <Text style={styles.linkText}>Login here</Text>
            </Text>

            {/* EMAIL */}
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* PASSWORD */}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secure}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)}>
                    <Ionicons
                        name={secure ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#666"
                    />
                </TouchableOpacity>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* DIVIDER */}
            <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
            </View>

            {/* GOOGLE SIGN UP (PHOTO MATCHING) */}
            <TouchableOpacity style={styles.googleButton}>
                <Image
                    source={Images.google}
                    style={styles.googleIcon}
                />
                <Text style={styles.googleText}>
                    Sign Up with Google
                </Text>
            </TouchableOpacity>

        </View>
    );
}
