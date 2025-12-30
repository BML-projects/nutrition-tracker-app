import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../src/styles/home";
import { Images } from "../../src/constants/images";
import { useRouter } from "expo-router";

/* ---------- DYNAMIC CALENDAR DATA ---------- */
const getWeekDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        days.push({
            dateNum: date.getDate().toString(),
            dayName: date
                .toLocaleDateString("en-US", { weekday: "short" })
                .toUpperCase(),
            progress: 0, // sync value (can be dynamic later)
            active: i === 1, // FRI-like active position
        });
    }
    return days;
};

export default function Home() {
    const router = useRouter();
    const days = getWeekDays();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* HEADER LOGO */}
                <View style={styles.logoRow}>
                    <Image source={Images.logo} style={styles.logoImage} />
                </View>

                {/* CALENDAR STRIP */}
                <View style={styles.calendarRow}>
                    {days.map((item, index) => (
                        <View key={index} style={styles.dayItem}>
                            <View style={styles.progressRing}>
                                <Text style={styles.progressText}>
                                    {item.progress}%
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.dateText,
                                    item.active && styles.activeText,
                                ]}
                            >
                                {item.dateNum}
                            </Text>
                            <Text
                                style={[
                                    styles.dayText,
                                    item.active && styles.activeText,
                                ]}
                            >
                                {item.dayName}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* MAIN CARD */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            Nutrient Intake Analysis
                        </Text>

                        {/* CLICKABLE INFO ICON */}
                        <TouchableOpacity
                            onPress={() =>
                                Alert.alert(
                                    "Info",
                                    "Shows your daily calorie intake summary."
                                )
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
                            <Text style={styles.calorieNumber}>1800</Text>
                            <Text style={styles.calorieLabel}>
                                Calories Consumed
                            </Text>
                        </View>

                        <View style={styles.kcalRing}>
                            <Text style={styles.kcalText}>KCAL</Text>
                        </View>
                    </View>
                </View>

                {/* RECENT ACTIVITIES */}
                <Text style={styles.sectionTitle}>
                    Recent Activities
                </Text>

                <View style={styles.emptyBox}>
                    <Text style={styles.emptyTitle}>
                        NO recent meals recorded
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        Tap to add one.
                    </Text>
                </View>

                {/* ADD BUTTON */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/camera")}
                >
                    <Ionicons name="add" size={32} color="#000" />
                </TouchableOpacity>
            </ScrollView>

            {/* BOTTOM NAVIGATION */}
            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={() => router.replace("/home")}>
                    <Ionicons name="home" size={26} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/camera")}>
                    <Ionicons name="camera" size={26} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/stats")}>
                    <Ionicons name="bar-chart" size={26} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/settings")}>
                    <Ionicons name="settings" size={26} color="#aaa" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
