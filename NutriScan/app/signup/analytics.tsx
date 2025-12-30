import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../../src/styles/analytics";

// Define the time ranges for our charts
type Range = "7 days" | "30 days" | "90 days";

// Structure for a single chart's dataset
interface ChartData {
    labels: string[]; // X-axis labels like dates
    values: number[]; // Y-axis values
}

// Holds data for all 3 time ranges
interface RangeBlock {
    ranges: Range[];
    data: Record<Range, ChartData>;
}

// Structure for the bottom summary card
interface WeeklyProgress {
    dateRange: string;
    goal: number;
    consumed: number;
    burned: number;
    net: number;
    conclusion: string;
}

// The full shape of the API response
interface BackendResponse {
    weightLog: RangeBlock;
    goalStatus: string;
    netCalories: RangeBlock;
    weeklyProgress: WeeklyProgress;
}

// Mock Backend Data - Simulating Database + AI response
const mockBackendData: BackendResponse = {
    weightLog: {
        ranges: ["7 days", "30 days", "90 days"],
        data: {
            "7 days": {
                labels: ["12/02", "12/06", "12/10", "12/14", "12/18", "12/22"],
                values: [60, 60, 60, 60, 60, 60], // Simulating a flat line
            },
            "30 days": {
                labels: ["W1", "W2", "W3", "W4"],
                values: [61, 60.8, 60.5, 60],
            },
            "90 days": {
                labels: ["M1", "M2", "M3"],
                values: [62, 61, 60],
            },
        },
    },

    goalStatus: "You are maintaining your current weight",

    netCalories: {
        ranges: ["7 days", "30 days", "90 days"],
        data: {
            "7 days": {
                labels: ["12/02", "12/06", "12/10", "12/14", "12/18", "12/22"],
                values: [0, 0, 0, 0, 0, 0],
            },
            "30 days": {
                labels: ["W1", "W2", "W3", "W4"],
                values: [2200, 2000, 1800, 1600],
            },
            "90 days": {
                labels: ["M1", "M2", "M3"],
                values: [2500, 2200, 2000],
            },
        },
    },

    weeklyProgress: {
        dateRange: "2 December 2025 – 16 December 2025",
        goal: 10000,
        consumed: 0,
        burned: 0,
        net: 0,
        conclusion: "10000 kcal left",
    },
};

// Helper: The pill-shaped toggle switch
const SegmentedControl = ({
    ranges,
    active,
    onChange,
}: {
    ranges: Range[];
    active: Range;
    onChange: (r: Range) => void;
}) => (
    <View style={styles.segment}>
        {ranges.map((r) => (
            <TouchableOpacity
                key={r}
                style={[styles.segmentBtn, active === r && styles.segmentActive]}
                onPress={() => onChange(r)}
            >
                <Text style={[styles.segmentText, active === r && styles.segmentTextActive]}>
                    {r}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

// Helper: Renders the visual grid for charts
const ChartGrid = ({ labels }: { labels: string[] }) => (
    <View style={styles.chart}>
        {labels.map((l) => (
            <View key={l} style={styles.chartCol}>
                {/* The bottom border here acts as the 'Trend Line' */}
                <View style={styles.chartBar} />
                <Text style={styles.chartLabel}>{l}</Text>
            </View>
        ))}
    </View>
);

// Main Screen Component
export default function AnalyticsScreen() {
    const router = useRouter();
    // Using mock data for now, replace with API call later
    const data = mockBackendData;

    // State for toggles
    const [weightRange, setWeightRange] = useState<Range>("7 days");
    const [calRange, setCalRange] = useState<Range>("7 days");

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Analytics</Text>

                {/* Section 1: Weight Log */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Weight Log</Text>

                    <SegmentedControl
                        ranges={data.weightLog.ranges}
                        active={weightRange}
                        onChange={setWeightRange}
                    />

                    <ChartGrid labels={data.weightLog.data[weightRange].labels} />
                </View>

                {/* Section 2: Goal Status */}
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Ionicons name="trophy-outline" size={18} />
                        <Text style={styles.cardTitle}>Goal Achievement status</Text>
                    </View>
                    <View style={styles.dashedBox}>
                        <Text style={styles.centerText}>{data.goalStatus}</Text>
                    </View>
                </View>

                {/* Section 3: Net Calories */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Net calories</Text>
                    <SegmentedControl
                        ranges={data.netCalories.ranges}
                        active={calRange}
                        onChange={setCalRange}
                    />
                    <ChartGrid labels={data.netCalories.data[calRange].labels} />
                </View>

                {/* Section 4: Weekly Progress Summary */}
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Ionicons name="calendar-outline" size={18} />
                        <Text style={styles.cardTitle}>Weekly Progress</Text>
                    </View>

                    <Text style={styles.subTitle}>{data.weeklyProgress.dateRange}</Text>

                    {/* Loop through data to create table rows */}
                    {Object.entries({
                        Goal: data.weeklyProgress.goal,
                        Consumed: data.weeklyProgress.consumed,
                        Burned: data.weeklyProgress.burned,
                        "Net calories": data.weeklyProgress.net,
                        Conclusion: data.weeklyProgress.conclusion,
                    }).map(([k, v]) => (
                        <View key={k} style={styles.row}>
                            <Text>{k}</Text>
                            <Text style={styles.bold}>{v}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.nav}>
                <TouchableOpacity onPress={() => router.push("/signup/home")}>
                    <Ionicons name="home-outline" size={24} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/camera")}>
                    <Ionicons name="camera-outline" size={24} color="#aaa" />
                </TouchableOpacity>

                {/* Active Tab Highlight */}
                <View style={styles.navActive}>
                    <Ionicons name="bar-chart" size={24} color="#000" />
                </View>

                <TouchableOpacity onPress={() => router.push("/settings")}>
                    <Ionicons name="settings-outline" size={24} color="#aaa" />
                </TouchableOpacity>
            </View>
        </View>
    );
}