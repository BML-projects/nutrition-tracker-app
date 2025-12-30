import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Images } from "../src/constants/images";
import { styles } from "../src/styles/login";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secure, setSecure] = useState(true);

    return (
        <View style={styles.container}>

            {/* TITLE */}
            <Text style={styles.title}>Welcome</Text>

            <Text style={styles.subtitle}>
                {"Don't have an account? "}
                <Text
                    style={[styles.linkText, { textDecorationLine: 'underline' }]} // optional underline
                    onPress={() => router.push("./signup")}
                >
                    Signup Here
                </Text>
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
            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => alert('logged in')}
                activeOpacity={0.8}
            >
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
                <Text style={styles.googleText} onPress={() => router.push("../signup/home")}>
                    Sign Up with Google
                </Text>
            </TouchableOpacity>

        </View>
    );
}
