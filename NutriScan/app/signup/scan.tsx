import React, { useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../../src/styles/scan";

export default function CameraScreen() {
    const router = useRouter();
    const cameraRef = useRef<any>(null);

    const [permission, requestPermission] = useCameraPermissions();

    /* ================= Permission Handling ================= */
    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    Camera access is required to scan food
                </Text>

                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                >
                    <Text style={styles.permissionButtonText}>Allow Camera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    /* ================= Capture Photo ================= */
    const handleCapture = async () => {
        try {
            if (!cameraRef.current) return;

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
            });

            router.push({
                pathname: "/signup/fooddetails",
                params: { imageUri: photo.uri },
            });
        } catch (error) {
            Alert.alert("Error", "Failed to capture image");
        }
    };

    return (
        <View style={styles.screen}>
            {/* ================= Header ================= */}
            <Text style={styles.header}>Food scan</Text>

            {/* ================= Camera View ================= */}
            <View style={styles.cameraWrapper}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing="back"
                />

                {/* Focus Brackets */}
                <View style={styles.focusOverlay}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View>

                {/* Tip Overlay */}
                <View style={styles.tipContainer}>
                    <Ionicons name="bulb" size={16} color="#FFD700" />
                    <Text style={styles.tipText}>
                        Keep the food within the guidelines, hold steady to avoid blur and avoid tilted angles
                    </Text>
                </View>
            </View>

            {/* ================= Controls ================= */}
            <View style={styles.controls}>
                <View style={styles.instructionPill}>
                    <Text style={styles.instructionText}>SNAP YOUR FOOD</Text>
                </View>

                <TouchableOpacity onPress={handleCapture}>
                    <Ionicons name="aperture-outline" size={60} color="#000" />
                </TouchableOpacity>
            </View>

            {/* ================= Bottom Navigation ================= */}
            <View style={styles.nav}>
                <TouchableOpacity onPress={() => router.push("/signup/home")}>
                    <Ionicons name="home-outline" size={24} color="#aaa" />
                </TouchableOpacity>

                {/* Active Camera Tab */}
                <View style={styles.navActive}>
                    <Ionicons name="camera" size={24} color="#000" />
                </View>

                <TouchableOpacity onPress={() => router.push("/signup/analytics")}>
                    <Ionicons name="bar-chart-outline" size={24} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/signup/setting")}>
                    <Ionicons name="settings-outline" size={24} color="#aaa" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
