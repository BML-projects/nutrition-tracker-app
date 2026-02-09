import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "../../src/styles/analytics";
import BottomNav from "./ButtomNav";

const { width } = Dimensions.get('window');

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

// Structure for daily breakdown
interface DailyData {
    date: string;
    consumed: number;
    burned: number;
    net: number;
}

// Structure for the weekly summary
interface WeeklyProgress {
    dateRange: string;
    goal: number;
    consumed: number;
    burned: number;
    net: number;
    remaining: number;
    dailyBreakdown: DailyData[];
}

// Streak data
interface StreakData {
    current: number;
    longest: number;
    weeklyGoalsMet: number;
}

// The full shape of the API response
interface BackendResponse {
    weightLog: RangeBlock;
    goalStatus: string;
    goalProgress: number; // 0-100 percentage
    netCalories: RangeBlock;
    weeklyProgress: WeeklyProgress;
    streakData: StreakData;
    avgDailyCalories: number;
    weightChange: {
        value: number;
        trend: 'up' | 'down' | 'stable';
    };
}

// Realistic Mock Backend Data
const mockBackendData: BackendResponse = {
    weightLog: {
        ranges: ["7 days", "30 days", "90 days"],
        data: {
            "7 days": {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                values: [72.5, 72.3, 72.1, 72.0, 71.8, 71.7, 71.5], // Gradual decrease
            },
            "30 days": {
                labels: ["W1", "W2", "W3", "W4"],
                values: [73.2, 72.6, 72.1, 71.5],
            },
            "90 days": {
                labels: ["Dec", "Jan", "Feb"],
                values: [75.0, 73.0, 71.5],
            },
        },
    },

    goalStatus: "Great progress! You're on track to reach your goal weight",
    goalProgress: 68, // 68% towards goal

    netCalories: {
        ranges: ["7 days", "30 days", "90 days"],
        data: {
            "7 days": {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                values: [-250, -180, -320, -150, -280, -100, -220], // Deficit pattern
            },
            "30 days": {
                labels: ["W1", "W2", "W3", "W4"],
                values: [-1800, -1600, -1900, -1500],
            },
            "90 days": {
                labels: ["Dec", "Jan", "Feb"],
                values: [-6500, -7200, -6800],
            },
        },
    },

    weeklyProgress: {
        dateRange: "Feb 2 - Feb 9, 2026",
        goal: 10500, // Weekly deficit goal
        consumed: 14280, // Total consumed this week
        burned: 3150, // Total burned through exercise
        net: -1370, // Net deficit
        remaining: 9130, // Remaining to meet goal
        dailyBreakdown: [
            { date: "Mon", consumed: 2100, burned: 450, net: -350 },
            { date: "Tue", consumed: 1950, burned: 380, net: -180 },
            { date: "Wed", consumed: 2200, burned: 520, net: -320 },
            { date: "Thu", consumed: 2050, burned: 400, net: -150 },
            { date: "Fri", consumed: 2100, burned: 480, net: -280 },
            { date: "Sat", consumed: 2180, burned: 480, net: -100 },
            { date: "Sun", consumed: 1700, burned: 440, net: -220 },
        ],
    },

    streakData: {
        current: 12, // 12 days streak
        longest: 24, // Best streak
        weeklyGoalsMet: 3, // Met weekly goal 3 times this month
    },

    avgDailyCalories: 2040,

    weightChange: {
        value: -1.7, // Lost 1.7 kg this month
        trend: 'down',
    },
};

// Enhanced Segmented Control
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

// Enhanced Chart Component with actual bars
const EnhancedChart = ({ 
    labels, 
    values, 
    color = '#4CAF50',
    showValues = false,
    maxValue,
}: { 
    labels: string[]; 
    values: number[];
    color?: string;
    showValues?: boolean;
    maxValue?: number;
}) => {
    const max = maxValue || Math.max(...values.map(Math.abs));
    const isNegative = values.some(v => v < 0);
    
    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
                {values.map((value, index) => {
                    const absValue = Math.abs(value);
                    const heightPercentage = max > 0 ? (absValue / max) * 100 : 0;
                    
                    return (
                        <View key={index} style={styles.barColumn}>
                            {showValues && (
                                <Text style={styles.barValue}>
                                    {isNegative ? value : Math.round(value)}
                                </Text>
                            )}
                            <View style={styles.barContainer}>
                                <View 
                                    style={[
                                        styles.bar,
                                        { 
                                            height: `${heightPercentage}%`,
                                            backgroundColor: value < 0 ? '#4CAF50' : color,
                                        }
                                    ]} 
                                />
                            </View>
                            <Text style={styles.barLabel}>{labels[index]}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

// Stats Card Component
const StatsCard = ({ 
    icon, 
    label, 
    value, 
    subValue, 
    color,
    iconFamily = 'Ionicons'
}: { 
    icon: string; 
    label: string; 
    value: string; 
    subValue?: string;
    color: string;
    iconFamily?: 'Ionicons' | 'MaterialCommunityIcons';
}) => {
    const IconComponent = iconFamily === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
    
    return (
        <View style={styles.statsCard}>
            <View style={[styles.statsIconCircle, { backgroundColor: `${color}20` }]}>
                <IconComponent name={icon as any} size={24} color={color} />
            </View>
            <Text style={styles.statsValue}>{value}</Text>
            <Text style={styles.statsLabel}>{label}</Text>
            {subValue && <Text style={styles.statsSubValue}>{subValue}</Text>}
        </View>
    );
};

// Main Screen Component
export default function AnalyticsScreen() {
    const router = useRouter();
    const data = mockBackendData;

    // State for toggles
    const [weightRange, setWeightRange] = useState<Range>("7 days");
    const [calRange, setCalRange] = useState<Range>("7 days");

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Analytics</Text>
                        <Text style={styles.subtitle}>Track your progress</Text>
                    </View>
                    <TouchableOpacity style={styles.calendarBtn}>
                        <Ionicons name="calendar-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats Row */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.quickStats}
                    contentContainerStyle={styles.quickStatsContent}
                >
                    <StatsCard 
                        icon="flame"
                        label="Avg Daily"
                        value={`${data.avgDailyCalories}`}
                        subValue="calories"
                        color="#FF6B6B"
                    />
                    <StatsCard 
                        icon="trending-down"
                        label="Weight Change"
                        value={`${data.weightChange.value} kg`}
                        subValue="this month"
                        color="#4CAF50"
                    />
                    <StatsCard 
                        icon="trophy"
                        label="Current Streak"
                        value={`${data.streakData.current}`}
                        subValue="days"
                        color="#FF9800"
                    />
                    <StatsCard 
                        icon="arm-flex"
                        iconFamily="MaterialCommunityIcons"
                        label="Weekly Goals"
                        value={`${data.streakData.weeklyGoalsMet}/4`}
                        subValue="met"
                        color="#9C27B0"
                    />
                </ScrollView>

                {/* Section 1: Weight Log */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardTitle}>Weight Progress</Text>
                            <Text style={styles.cardSubtitle}>
                                {weightRange === "7 days" && "Last 7 days"}
                                {weightRange === "30 days" && "Last 4 weeks"}
                                {weightRange === "90 days" && "Last 3 months"}
                            </Text>
                        </View>
                        <View style={styles.weightBadge}>
                            <Ionicons name="trending-down" size={16} color="#4CAF50" />
                            <Text style={styles.weightBadgeText}>-1.7 kg</Text>
                        </View>
                    </View>

                    <SegmentedControl
                        ranges={data.weightLog.ranges}
                        active={weightRange}
                        onChange={setWeightRange}
                    />

                    <EnhancedChart 
                        labels={data.weightLog.data[weightRange].labels}
                        values={data.weightLog.data[weightRange].values}
                        color="#2196F3"
                        showValues={true}
                        maxValue={76}
                    />

                    <View style={styles.weightInfo}>
                        <View style={styles.weightInfoItem}>
                            <Text style={styles.weightInfoLabel}>Starting</Text>
                            <Text style={styles.weightInfoValue}>
                                {data.weightLog.data[weightRange].values[0]} kg
                            </Text>
                        </View>
                        <View style={styles.weightInfoDivider} />
                        <View style={styles.weightInfoItem}>
                            <Text style={styles.weightInfoLabel}>Current</Text>
                            <Text style={styles.weightInfoValue}>
                                {data.weightLog.data[weightRange].values[
                                    data.weightLog.data[weightRange].values.length - 1
                                ]} kg
                            </Text>
                        </View>
                        <View style={styles.weightInfoDivider} />
                        <View style={styles.weightInfoItem}>
                            <Text style={styles.weightInfoLabel}>Goal</Text>
                            <Text style={styles.weightInfoValue}>68 kg</Text>
                        </View>
                    </View>
                </View>

                {/* Section 2: Goal Status with Progress */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="trophy-outline" size={22} color="#FF9800" />
                        <Text style={styles.cardTitle}>Goal Achievement</Text>
                    </View>
                    
                    <View style={styles.goalCard}>
                        <Text style={styles.goalText}>{data.goalStatus}</Text>
                        
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <LinearGradient
                                    colors={['#4CAF50', '#8BC34A']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressFill, { width: `${data.goalProgress}%` }]}
                                />
                            </View>
                            <Text style={styles.progressText}>{data.goalProgress}% Complete</Text>
                        </View>

                        <View style={styles.goalStats}>
                            <View style={styles.goalStatItem}>
                                <Ionicons name="flag-outline" size={18} color="#666" />
                                <Text style={styles.goalStatLabel}>Target</Text>
                                <Text style={styles.goalStatValue}>68 kg</Text>
                            </View>
                            <View style={styles.goalStatItem}>
                                <Ionicons name="location-outline" size={18} color="#666" />
                                <Text style={styles.goalStatLabel}>Current</Text>
                                <Text style={styles.goalStatValue}>71.5 kg</Text>
                            </View>
                            <View style={styles.goalStatItem}>
                                <Ionicons name="analytics-outline" size={18} color="#666" />
                                <Text style={styles.goalStatLabel}>Remaining</Text>
                                <Text style={styles.goalStatValue}>3.5 kg</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Section 3: Net Calories */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardTitle}>Calorie Deficit</Text>
                            <Text style={styles.cardSubtitle}>
                                {calRange === "7 days" && "Daily deficit"}
                                {calRange === "30 days" && "Weekly deficit"}
                                {calRange === "90 days" && "Monthly deficit"}
                            </Text>
                        </View>
                        <View style={[styles.weightBadge, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.weightBadgeText}>On track</Text>
                        </View>
                    </View>

                    <SegmentedControl
                        ranges={data.netCalories.ranges}
                        active={calRange}
                        onChange={setCalRange}
                    />

                    <EnhancedChart 
                        labels={data.netCalories.data[calRange].labels}
                        values={data.netCalories.data[calRange].values}
                        color="#4CAF50"
                        showValues={true}
                    />
                </View>

                {/* Section 4: Weekly Progress Summary */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="calendar-outline" size={22} color="#2196F3" />
                        <Text style={styles.cardTitle}>Weekly Progress</Text>
                    </View>

                    <Text style={styles.dateRange}>{data.weeklyProgress.dateRange}</Text>

                    {/* Summary Cards */}
                    <View style={styles.summaryGrid}>
                        <View style={[styles.summaryCard, { borderLeftColor: '#FF6B6B' }]}>
                            <Ionicons name="flame" size={20} color="#FF6B6B" />
                            <Text style={styles.summaryCardValue}>
                                {data.weeklyProgress.consumed.toLocaleString()}
                            </Text>
                            <Text style={styles.summaryCardLabel}>Consumed</Text>
                        </View>

                        <View style={[styles.summaryCard, { borderLeftColor: '#4CAF50' }]}>
                            <MaterialCommunityIcons name="run" size={20} color="#4CAF50" />
                            <Text style={styles.summaryCardValue}>
                                {data.weeklyProgress.burned.toLocaleString()}
                            </Text>
                            <Text style={styles.summaryCardLabel}>Burned</Text>
                        </View>

                        <View style={[styles.summaryCard, { borderLeftColor: '#2196F3' }]}>
                            <Ionicons name="analytics" size={20} color="#2196F3" />
                            <Text style={styles.summaryCardValue}>
                                {data.weeklyProgress.net}
                            </Text>
                            <Text style={styles.summaryCardLabel}>Net Deficit</Text>
                        </View>

                        <View style={[styles.summaryCard, { borderLeftColor: '#FF9800' }]}>
                            <Ionicons name="flag" size={20} color="#FF9800" />
                            <Text style={styles.summaryCardValue}>
                                {data.weeklyProgress.remaining.toLocaleString()}
                            </Text>
                            <Text style={styles.summaryCardLabel}>Remaining</Text>
                        </View>
                    </View>

                    {/* Daily Breakdown */}
                    <View style={styles.dailyBreakdown}>
                        <Text style={styles.breakdownTitle}>Daily Breakdown</Text>
                        {data.weeklyProgress.dailyBreakdown.map((day, index) => (
                            <View key={index} style={styles.breakdownRow}>
                                <Text style={styles.breakdownDay}>{day.date}</Text>
                                <View style={styles.breakdownBars}>
                                    <View style={styles.breakdownBarContainer}>
                                        <View 
                                            style={[
                                                styles.breakdownBar, 
                                                { 
                                                    width: `${(day.consumed / 2500) * 100}%`,
                                                    backgroundColor: '#FF6B6B'
                                                }
                                            ]} 
                                        />
                                    </View>
                                    <View style={styles.breakdownBarContainer}>
                                        <View 
                                            style={[
                                                styles.breakdownBar, 
                                                { 
                                                    width: `${(day.burned / 600) * 100}%`,
                                                    backgroundColor: '#4CAF50'
                                                }
                                            ]} 
                                        />
                                    </View>
                                </View>
                                <Text style={[
                                    styles.breakdownNet,
                                    { color: day.net < 0 ? '#4CAF50' : '#FF6B6B' }
                                ]}>
                                    {day.net}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Streak & Achievements */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="ribbon-outline" size={22} color="#9C27B0" />
                        <Text style={styles.cardTitle}>Achievements</Text>
                    </View>

                    <View style={styles.achievementsGrid}>
                        <LinearGradient
                            colors={['#FF9800', '#F57C00']}
                            style={styles.achievementCard}
                        >
                            <Ionicons name="flame" size={32} color="#fff" />
                            <Text style={styles.achievementValue}>{data.streakData.current}</Text>
                            <Text style={styles.achievementLabel}>Day Streak</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#9C27B0', '#7B1FA2']}
                            style={styles.achievementCard}
                        >
                            <Ionicons name="trophy" size={32} color="#fff" />
                            <Text style={styles.achievementValue}>{data.streakData.longest}</Text>
                            <Text style={styles.achievementLabel}>Best Streak</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#4CAF50', '#388E3C']}
                            style={styles.achievementCard}
                        >
                            <Ionicons name="checkmark-done" size={32} color="#fff" />
                            <Text style={styles.achievementValue}>{data.streakData.weeklyGoalsMet}</Text>
                            <Text style={styles.achievementLabel}>Goals Met</Text>
                        </LinearGradient>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNav /> 
        </View>
    );
}