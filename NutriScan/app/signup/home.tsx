import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../../src/styles/home";
import { Images } from "../../src/constants/images";

// Define the shape of data coming from the backend
interface CalendarDay {
    id: string;
    dateNum: string;
    dayName: string;
    progress: number;
    isSelected: boolean;
}

interface NutrientData {
    caloriesConsumed: number;
    dailyGoal: number;
    pctAchieved: number;
    aiAnalysis: string;
}

interface Activity {
    id: string;
    description: string;
    subText: string;
}

interface DashboardResponse {
    calendar: CalendarDay[];
    nutrition: NutrientData;
    recentActivities: Activity[];
}

// Simulating an API call to fetch user dashboard data
const fetchDashboardData = (): Promise<DashboardResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const today = new Date();
            const days: CalendarDay[] = [];

            // Create a 7-day view centered on today
            for (let i = -3; i <= 3; i++) {
                const d = new Date();
                d.setDate(today.getDate() + i);

                // Mocking progress: random for past days, fixed for today, 0 for future
                let progressValue = 0;
                if (i < 0) progressValue = Math.floor(Math.random() * 100);
                if (i === 0) progressValue = 65;

                days.push({
                    id: `day-${i}`,
                    dateNum: d.getDate().toString(),
                    dayName: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
                    progress: progressValue,
                    isSelected: i === 0,
                });
            }

            resolve({
                calendar: days,
                nutrition: {
                    caloriesConsumed: 1800,
                    dailyGoal: 2200,
                    pctAchieved: 82,
                    aiAnalysis: "You've hit 82% of your goal. A light dinner is recommended."
                },
                recentActivities: [], // Leaves the list empty to show the placeholder
            });
        }, 1200);
    });
};

export default function Home() {
    const router = useRouter();
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch data when the screen loads
    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetchDashboardData();
                setData(response);
            } catch (e) {
                console.error("Error fetching data", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#32CD32" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Top Logo */}
                <View style={styles.logoRow}>
                    <Image source={Images.logo} style={styles.logoImage} />
                </View>

                {/* Weekly Calendar Strip */}
                <View style={styles.calendarRow}>
                    {data?.calendar.map((item) => (
                        <View key={item.id} style={styles.dayItem}>
                            <View style={styles.progressRing}>
                                <Text style={styles.progressText}>
                                    {item.progress}%
                                </Text>
                            </View>

                            <Text
                                style={[
                                    styles.dateText,
                                    item.isSelected && styles.activeText,
                                ]}
                            >
                                {item.dateNum}
                            </Text>
                            <Text
                                style={[
                                    styles.dayText,
                                    item.isSelected && styles.activeText,
                                ]}
                            >
                                {item.dayName}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Main Nutrition Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            Nutrient Intake Analysis
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                Alert.alert("AI Analysis", data?.nutrition.aiAnalysis)
                            }
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={22}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardContent}>
                        <View>
                            <Text style={styles.calorieNumber}>
                                {data?.nutrition.caloriesConsumed}
                            </Text>
                            <Text style={styles.calorieLabel}>
                                Calories Consumed
                            </Text>
                        </View>

                        <View style={styles.kcalRing}>
                            <Text style={styles.kcalText}>KCAL</Text>
                        </View>
                    </View>
                </View>

                {/* Activity Section */}
                <Text style={styles.sectionTitle}>
                    Recent Activities
                </Text>

                {/* Show list or empty state based on data */}
                {data && data.recentActivities.length > 0 ? (
                    <View>
                        {data.recentActivities.map(act => (
                            <Text key={act.id}>{act.description}</Text>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyTitle}>
                            NO recent meals recorded
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            Tap to add one.
                        </Text>
                    </View>
                )}

                {/* Floating Add Button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/signup/fooddetails")}
                >
                    <Ionicons name="add" size={32} color="#000" />
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={() => router.replace("./home")}>
                    <Ionicons name="home" size={26} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/signup/scan")}>
                    <Ionicons name="camera" size={26} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/signup/analytics")}>
                    <Ionicons name="bar-chart" size={26} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/signup/setting")}>
                    <Ionicons name="settings" size={26} color="#aaa" />
                </TouchableOpacity>
            </View>
        </View>
    );
}