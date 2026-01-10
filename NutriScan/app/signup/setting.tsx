import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../../src/styles/setting";
import { logout } from "@/services/auth-api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ================= MOCK BACKEND DATA ================= */

interface UserProfile {
    username: string;
    email: string;
    goal: "Lose Weight" | "Maintain" | "Gain Weight";
    appearance: "Light" | "Dark";
}

const mockUserData: UserProfile = {
    username: "BMLRTBH",
    email: "bml12345678@gmail.com",
    goal: "Maintain",
    appearance: "Light",
};

export default function SettingsScreen() {
    const router = useRouter();

    const [appearance, setAppearance] = useState(mockUserData.appearance);
    const [goal, setGoal] = useState(mockUserData.goal);
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const [showGoalOptions, setShowGoalOptions] = useState(false);

    const handleLogout = async () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { 
        text: "Logout", 
        onPress: async () => {
          try {
            // Call your logout API
            await logout();
            
            // Clear AsyncStorage
            await AsyncStorage.multiRemove(['accessToken', 'userData']);
            
            // Navigate to login screen
            router.replace('/login');
            
            // Optional: Show success message
            // showSuccess('Logged out successfully');
          } catch (error) {
            console.error('Logout error:', error);
            // Even if API fails, clear local storage and redirect
            await AsyncStorage.multiRemove(['accessToken', 'userData']);
            router.replace('/login');
          }
        }
      }
    ]
  );
};

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* ================= HEADER ================= */}
                <Text style={styles.title}>Settings</Text>

                {/* ================= PERSONAL INFO ================= */}
                <View style={styles.section}>
                    <Text style={styles.sectionBadge}>Personal Information</Text>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Personalization Settings</Text>
                        <Text style={styles.cardSub}>
                            Update your body and measurement info
                        </Text>

                        {/* Goal Row */}
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => setShowGoalOptions(!showGoalOptions)}
                        >
                            <Text style={styles.rowLabel}>Goal</Text>

                            <View style={styles.rowRight}>
                                <Text style={styles.valueText}>{goal}</Text>
                                <Ionicons name="chevron-forward" size={18} />
                            </View>
                        </TouchableOpacity>

                        {showGoalOptions && (
                            <View style={styles.optionBox}>
                                {["Lose Weight", "Maintain", "Gain Weight"].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={styles.optionRow}
                                        onPress={() => {
                                            setGoal(item as any);
                                            setShowGoalOptions(false);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* ================= APPEARANCE ================= */}
                <View style={styles.section}>
                    <Text style={styles.sectionBadge}>Appearance</Text>

                    <View style={styles.card}>
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => setShowThemeOptions(!showThemeOptions)}
                        >
                            <Text style={styles.rowLabel}>Customize the Appearance</Text>

                            <View style={styles.appearancePill}>
                                <Text style={styles.appearanceText}>{appearance}</Text>
                                <Ionicons name="chevron-down" size={14} />
                            </View>
                        </TouchableOpacity>

                        {showThemeOptions && (
                            <View style={styles.optionBox}>
                                {["Light", "Dark"].map((mode) => (
                                    <TouchableOpacity
                                        key={mode}
                                        style={styles.optionRow}
                                        onPress={() => {
                                            setAppearance(mode as any);
                                            setShowThemeOptions(false);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{mode}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* ================= PROFILE ================= */}
                <View style={styles.section}>
                    <Text style={styles.sectionBadge}>Profile</Text>

                    <View style={styles.profileCard}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color="#fff" />
                        </View>

                        <Text style={styles.username}>{mockUserData.username}</Text>
                        <Text style={styles.email}>{mockUserData.email}</Text>
                    </View>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="person-outline" size={20} />
                        <Text style={styles.menuText}>My Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="stats-chart-outline" size={20} />
                        <Text style={styles.menuText}>My Progress</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
  style={styles.menuItem}
  onPress={handleLogout}
>
  <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
  <Text style={[styles.menuText, { color: '#FF3B30' }]}>Logout</Text>
</TouchableOpacity>
                </View>
            </ScrollView>

            {/* ================= BOTTOM NAV ================= */}
            <View style={styles.nav}>
                <TouchableOpacity onPress={() => router.push("./signup/home")}>
                    <Ionicons name="home-outline" size={24} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/signup/scan")}>
                    <Ionicons name="camera-outline" size={24} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/signup/analytics")}>
                    <Ionicons name="bar-chart-outline" size={24} color="#aaa" />
                </TouchableOpacity>

                <View style={styles.navActive}>
                    <Ionicons name="settings" size={22} color="#000" />
                </View>
            </View>
        </View>
    );
}
