import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    Alert,
    Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "../../src/styles/analytics";
import BottomNav from "./ButtomNav";
import { getAnalyticsSummary } from "@/services/analytics-api";

const { width } = Dimensions.get('window');

type Range = "7 days" | "30 days" | "90 days";

interface ChartData {
    labels: string[];
    values: number[];
}

interface RangeBlock {
    ranges: Range[];
    data: Record<Range, ChartData>;
}

interface DailyData {
    date: string;
    consumed: number;
    burned: number;
    net: number;
}

interface WeeklyProgress {
    dateRange: string;
    goal: number;
    consumed: number;
    burned: number;
    net: number;
    remaining: number;
    dailyBreakdown: DailyData[];
}

interface StreakData {
    current: number;
    longest: number;
    weeklyGoalsMet: number;
}

interface GoalProgressData {
    goalStatus: string;
    goalProgress: number;
    targetWeight: number;
    currentWeight: number;
    remaining: number;
}

interface BackendResponse {
    success: boolean;
    weightLog: RangeBlock;
    goalProgress: GoalProgressData;
    netCalories: RangeBlock;
    weeklyProgress: WeeklyProgress;
    streakData: StreakData;
    avgDailyCalories: number;
    weightChange: {
        value: number;
        trend: 'up' | 'down' | 'stable';
    };
}

// Enhanced Segmented Control
const SegmentedControl = ({
    ranges,
    active,
    onChange,
}: {
    ranges: Range[];
    active: Range;
    onChange: (r: Range) => void;
}) => {
    return (
        <View style={styles.segment}>
            {ranges.map((r) => (
                <TouchableOpacity
                    key={r}
                    style={[styles.segmentBtn, active === r && styles.segmentActive]}
                    onPress={() => onChange(r)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.segmentText, active === r && styles.segmentTextActive]}>
                        {r}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// Enhanced Chart Component
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
    const [animatedValues] = useState(values.map(() => new Animated.Value(0)));
    const max = maxValue || Math.max(...values.map(Math.abs), 1);
    const isNegative = values.some(v => v < 0);
    
    useEffect(() => {
        const animations = values.map((value, index) => {
            const absValue = Math.abs(value);
            const heightPercentage = max > 0 ? (absValue / max) * 100 : 0;
            
            return Animated.spring(animatedValues[index], {
                toValue: heightPercentage,
                useNativeDriver: false,
                tension: 40,
                friction: 7,
                delay: index * 50,
            });
        });

        Animated.parallel(animations).start();
    }, [values, max]);
    
    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
                {values.map((value, index) => {
                    const heightPercentage = animatedValues[index].interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                    });
                    
                    return (
                        <View key={index} style={styles.barColumn}>
                            {showValues && (
                                <Animated.Text 
                                    style={[
                                        styles.barValue,
                                        { 
                                            opacity: animatedValues[index].interpolate({
                                                inputRange: [0, 100],
                                                outputRange: [0, 1],
                                            }),
                                            color: value < 0 ? '#4CAF50' : '#1a1a1a',
                                        }
                                    ]}
                                >
                                    {isNegative ? value : Math.round(value)}
                                </Animated.Text>
                            )}
                            <View style={styles.barContainer}>
                                <Animated.View 
                                    style={[
                                        styles.bar,
                                        { 
                                            height: heightPercentage,
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
    iconFamily = 'Ionicons',
}: { 
    icon: string; 
    label: string; 
    value: string; 
    subValue?: string;
    color: string;
    iconFamily?: 'Ionicons' | 'MaterialCommunityIcons';
}) => {
    const IconComponent = iconFamily === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
    const scaleAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();
    }, []);
    
    return (
        <Animated.View 
            style={[
                styles.statsCard,
                { transform: [{ scale: scaleAnim }] }
            ]}
        >
            <View style={[styles.statsIconCircle, { backgroundColor: `${color}20` }]}>
                <IconComponent name={icon as any} size={24} color={color} />
            </View>
            <Text style={styles.statsValue}>{value}</Text>
            <Text style={styles.statsLabel}>{label}</Text>
            {subValue && <Text style={styles.statsSubValue}>{subValue}</Text>}
        </Animated.View>
    );
};

// Goal Achievement Indicator
const GoalAchievementIndicator = ({ 
    goalProgress, 
    weightChange,
}: { 
    goalProgress: number;
    weightChange: { value: number; trend: 'up' | 'down' | 'stable' };
}) => {
    const onTrack = weightChange.trend === 'down' || goalProgress > 0;
    const statusColor = onTrack ? '#4CAF50' : '#FF9800';
    const statusIcon = onTrack ? 'checkmark-circle' : 'alert-circle';

    return (
        <View style={[styles.weightBadge, { backgroundColor: `${statusColor}20` }]}>
            <Ionicons name={statusIcon} size={16} color={statusColor} />
            <Text style={[styles.weightBadgeText, { color: statusColor }]}>
                {onTrack ? 'On Track' : 'Keep Going'}
            </Text>
        </View>
    );
};

// Main Screen Component
export default function AnalyticsScreen() {
    const router = useRouter();

    // State
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState<BackendResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Range states
    const [weightRange, setWeightRange] = useState<Range>("7 days");
    const [calRange, setCalRange] = useState<Range>("7 days");

    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];

    // Fetch all analytics data
    const fetchAnalyticsData = useCallback(async () => {
        try {
            console.log("📊 [Analytics] Fetching analytics summary...");
            
            const response = await getAnalyticsSummary();
            console.log("📊 [Analytics] Full Response:", JSON.stringify(response, null, 2));

            if (response.success) {
                // Log the structure to debug
                console.log("📊 [Analytics] Weight Log Data:", response.weightLog);
                console.log("📊 [Analytics] Net Calories Data:", response.netCalories);
                console.log("📊 [Analytics] Goal Progress:", response.goalProgress);
                console.log("📊 [Analytics] Streak Data:", response.streakData);
                console.log("📊 [Analytics] Weekly Progress:", response.weeklyProgress);

                setData(response as BackendResponse);
                setError(null);

                // Trigger entrance animations
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        tension: 50,
                        friction: 10,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else {
                throw new Error(response.error || "Failed to load analytics");
            }
        } catch (err: any) {
            console.error("📊 [Analytics] Error:", err);
            setError(err.message || "Failed to load analytics");
            
            if (!refreshing) {
                Alert.alert(
                    "Unable to Load Analytics",
                    err.message || "Please check your connection and try again.",
                    [
                        { text: "Retry", onPress: fetchAnalyticsData },
                        { text: "Cancel" }
                    ]
                );
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing, fadeAnim, slideAnim]);

    // Fetch on mount and when screen comes into focus
    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAnalyticsData();
        }, [])
    );

    // Pull to refresh
    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAnalyticsData();
    }, [fetchAnalyticsData]);

    // Loading state
    if (loading) {
        return (
            <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#D37034" />
                <Text style={{ marginTop: 12, color: '#666', fontSize: 16 }}>
                    Loading analytics...
                </Text>
            </View>
        );
    }

    // Error state
    if (error || !data) {
        return (
            <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                <Text style={{ marginTop: 16, fontSize: 16, color: '#666', textAlign: 'center' }}>
                    {error || "Unable to load analytics"}
                </Text>
                <TouchableOpacity
                    style={{
                        marginTop: 20,
                        backgroundColor: '#D37034',
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 8,
                    }}
                    onPress={fetchAnalyticsData}
                >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Safe accessors with defaults
    const safeWeightData = data.weightLog?.data?.[weightRange] || { labels: [], values: [] };
    const safeCalorieData = data.netCalories?.data?.[calRange] || { labels: [], values: [] };
    const safeGoalProgress = data.goalProgress || {
        goalStatus: 'No goal set',
        goalProgress: 0,
        targetWeight: 0,
        currentWeight: 0,
        remaining: 0,
    };
    const safeStreakData = data.streakData || {
        current: 0,
        longest: 0,
        weeklyGoalsMet: 0,
    };
    const safeWeeklyProgress = data.weeklyProgress || {
        dateRange: '',
        goal: 0,
        consumed: 0,
        burned: 0,
        net: 0,
        remaining: 0,
        dailyBreakdown: [],
    };
    const safeWeightChange = data.weightChange || {
        value: 0,
        trend: 'stable' as const,
    };

    console.log("📊 [Analytics] Rendering with weight data:", safeWeightData);
    console.log("📊 [Analytics] Rendering with calorie data:", safeCalorieData);

    return (
        <View style={styles.screen}>
            <Animated.ScrollView 
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#D37034']}
                        tintColor="#D37034"
                    />
                }
                style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Analytics</Text>
                        <Text style={styles.subtitle}>Track your progress</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.calendarBtn}
                        onPress={() => router.push('./history')}
                    >
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
                        value={`${Math.round(data.avgDailyCalories || 0)}`}
                        subValue="calories"
                        color="#FF6B6B"
                    />
                    <StatsCard 
                        icon={safeWeightChange.trend === 'down' ? 'trending-down' : 
                              safeWeightChange.trend === 'up' ? 'trending-up' : 'remove'}
                        label="Weight Change"
                        value={`${safeWeightChange.value.toFixed(1)} kg`}
                        subValue={safeWeightChange.trend === 'down' ? '↓ Lost' : 
                                 safeWeightChange.trend === 'up' ? '↑ Gained' : '→ Stable'}
                        color={safeWeightChange.trend === 'down' ? '#4CAF50' : 
                               safeWeightChange.trend === 'up' ? '#FF6B6B' : '#999'}
                    />
                    <StatsCard 
                        icon="trophy"
                        label="Current Streak"
                        value={`${safeStreakData.current}`}
                        subValue="days"
                        color="#FF9800"
                    />
                    <StatsCard 
                        icon="arm-flex"
                        iconFamily="MaterialCommunityIcons"
                        label="Weekly Goals"
                        value={`${safeStreakData.weeklyGoalsMet}/4`}
                        subValue="met"
                        color="#9C27B0"
                    />
                </ScrollView>

                {/* Section 1: Weight Log */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>Weight Progress</Text>
                            <Text style={styles.cardSubtitle}>
                                {weightRange === "7 days" && "Last 7 days"}
                                {weightRange === "30 days" && "Last 4 weeks"}
                                {weightRange === "90 days" && "Last 3 months"}
                            </Text>
                        </View>
                        <GoalAchievementIndicator 
                            goalProgress={safeGoalProgress.goalProgress}
                            weightChange={safeWeightChange}
                        />
                    </View>

                    <SegmentedControl
                        ranges={data.weightLog?.ranges || ["7 days", "30 days", "90 days"]}
                        active={weightRange}
                        onChange={setWeightRange}
                    />

                    {safeWeightData.values.length > 0 ? (
                        <>
                            <EnhancedChart 
                                labels={safeWeightData.labels}
                                values={safeWeightData.values}
                                color="#2196F3"
                                showValues={true}
                                maxValue={Math.max(...safeWeightData.values) + 5}
                            />

                            <View style={styles.weightInfo}>
                                <View style={styles.weightInfoItem}>
                                    <Text style={styles.weightInfoLabel}>Starting</Text>
                                    <Text style={styles.weightInfoValue}>
                                        {safeWeightData.values[0].toFixed(1)} kg
                                    </Text>
                                </View>
                                <View style={styles.weightInfoDivider} />
                                <View style={styles.weightInfoItem}>
                                    <Text style={styles.weightInfoLabel}>Current</Text>
                                    <Text style={styles.weightInfoValue}>
                                        {safeWeightData.values[safeWeightData.values.length - 1].toFixed(1)} kg
                                    </Text>
                                </View>
                                {safeGoalProgress.targetWeight > 0 && (
                                    <>
                                        <View style={styles.weightInfoDivider} />
                                        <View style={styles.weightInfoItem}>
                                            <Text style={styles.weightInfoLabel}>Goal</Text>
                                            <Text style={styles.weightInfoValue}>
                                                {safeGoalProgress.targetWeight.toFixed(1)} kg
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </>
                    ) : (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Ionicons name="stats-chart-outline" size={48} color="#ccc" />
                            <Text style={{ marginTop: 12, color: '#999', textAlign: 'center' }}>
                                No weight data available for this period
                            </Text>
                            <Text style={{ marginTop: 8, color: '#ccc', fontSize: 12, textAlign: 'center' }}>
                                Start logging your weight to see progress
                            </Text>
                            <TouchableOpacity
                                style={{
                                    marginTop: 16,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    backgroundColor: '#D37034',
                                    borderRadius: 8,
                                }}
                                onPress={() => router.push('./home')}
                            >
                                <Text style={{ color: '#fff', fontWeight: '600' }}>
                                    Log Your Weight
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Section 2: Goal Status */}
                {safeGoalProgress.targetWeight > 0 && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="trophy-outline" size={22} color="#FF9800" />
                            <Text style={styles.cardTitle}>Goal Achievement</Text>
                        </View>
                        
                        <View style={styles.goalCard}>
                            <Text style={styles.goalText}>{safeGoalProgress.goalStatus}</Text>
                            
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <LinearGradient
                                        colors={['#4CAF50', '#8BC34A']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[
                                            styles.progressFill, 
                                            { width: `${Math.min(safeGoalProgress.goalProgress, 100)}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressText}>
                                    {safeGoalProgress.goalProgress}% Complete
                                </Text>
                            </View>

                            <View style={styles.goalStats}>
                                <View style={styles.goalStatItem}>
                                    <Ionicons name="flag-outline" size={18} color="#666" />
                                    <Text style={styles.goalStatLabel}>Target</Text>
                                    <Text style={styles.goalStatValue}>
                                        {safeGoalProgress.targetWeight.toFixed(1)} kg
                                    </Text>
                                </View>
                                <View style={styles.goalStatItem}>
                                    <Ionicons name="location-outline" size={18} color="#666" />
                                    <Text style={styles.goalStatLabel}>Current</Text>
                                    <Text style={styles.goalStatValue}>
                                        {safeGoalProgress.currentWeight.toFixed(1)} kg
                                    </Text>
                                </View>
                                <View style={styles.goalStatItem}>
                                    <Ionicons name="analytics-outline" size={18} color="#666" />
                                    <Text style={styles.goalStatLabel}>Remaining</Text>
                                    <Text style={styles.goalStatValue}>
                                        {safeGoalProgress.remaining.toFixed(1)} kg
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Section 3: Net Calories */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>Calorie Tracking</Text>
                            <Text style={styles.cardSubtitle}>
                                {calRange === "7 days" && "Daily balance"}
                                {calRange === "30 days" && "Weekly balance"}
                                {calRange === "90 days" && "Monthly balance"}
                            </Text>
                        </View>
                        <View style={[styles.weightBadge, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.weightBadgeText}>Tracking</Text>
                        </View>
                    </View>

                    <SegmentedControl
                        ranges={data.netCalories?.ranges || ["7 days", "30 days", "90 days"]}
                        active={calRange}
                        onChange={setCalRange}
                    />

                    {safeCalorieData.values.length > 0 ? (
                        <EnhancedChart 
                            labels={safeCalorieData.labels}
                            values={safeCalorieData.values}
                            color="#4CAF50"
                            showValues={true}
                        />
                    ) : (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Ionicons name="nutrition-outline" size={48} color="#ccc" />
                            <Text style={{ marginTop: 12, color: '#999', textAlign: 'center' }}>
                                No calorie data available for this period
                            </Text>
                            <Text style={{ marginTop: 8, color: '#ccc', fontSize: 12, textAlign: 'center' }}>
                                Start logging meals to see calorie tracking
                            </Text>
                            <TouchableOpacity
                                style={{
                                    marginTop: 16,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    backgroundColor: '#D37034',
                                    borderRadius: 8,
                                }}
                                onPress={() => router.push('./home')}
                            >
                                <Text style={{ color: '#fff', fontWeight: '600' }}>
                                    Log a Meal
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Section 4: Weekly Progress */}
                {safeWeeklyProgress.dailyBreakdown.length > 0 && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="calendar-outline" size={22} color="#2196F3" />
                            <Text style={styles.cardTitle}>Weekly Progress</Text>
                        </View>

                        <Text style={styles.dateRange}>{safeWeeklyProgress.dateRange}</Text>

                        <View style={styles.summaryGrid}>
                            <View style={[styles.summaryCard, { borderLeftColor: '#FF6B6B' }]}>
                                <Ionicons name="flame" size={20} color="#FF6B6B" />
                                <Text style={styles.summaryCardValue}>
                                    {safeWeeklyProgress.consumed.toLocaleString()}
                                </Text>
                                <Text style={styles.summaryCardLabel}>Consumed</Text>
                            </View>

                            <View style={[styles.summaryCard, { borderLeftColor: '#4CAF50' }]}>
                                <MaterialCommunityIcons name="run" size={20} color="#4CAF50" />
                                <Text style={styles.summaryCardValue}>
                                    {safeWeeklyProgress.burned.toLocaleString()}
                                </Text>
                                <Text style={styles.summaryCardLabel}>Burned</Text>
                            </View>

                            <View style={[styles.summaryCard, { borderLeftColor: '#2196F3' }]}>
                                <Ionicons name="analytics" size={20} color="#2196F3" />
                                <Text style={styles.summaryCardValue}>
                                    {safeWeeklyProgress.net.toLocaleString()}
                                </Text>
                                <Text style={styles.summaryCardLabel}>Net</Text>
                            </View>

                            <View style={[styles.summaryCard, { borderLeftColor: '#FF9800' }]}>
                                <Ionicons name="flag" size={20} color="#FF9800" />
                                <Text style={styles.summaryCardValue}>
                                    {safeWeeklyProgress.remaining.toLocaleString()}
                                </Text>
                                <Text style={styles.summaryCardLabel}>Remaining</Text>
                            </View>
                        </View>

                        <View style={styles.dailyBreakdown}>
                            <Text style={styles.breakdownTitle}>Daily Breakdown</Text>
                            {safeWeeklyProgress.dailyBreakdown.map((day, index) => (
                                <View key={index} style={styles.breakdownRow}>
                                    <Text style={styles.breakdownDay}>{day.date}</Text>
                                    <View style={styles.breakdownBars}>
                                        <View style={styles.breakdownBarContainer}>
                                            <View 
                                                style={[
                                                    styles.breakdownBar, 
                                                    { 
                                                        width: `${Math.min((day.consumed / 2500) * 100, 100)}%`,
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
                                                        width: `${Math.min((day.burned / 600) * 100, 100)}%`,
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
                )}

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
                            <Text style={styles.achievementValue}>{safeStreakData.current}</Text>
                            <Text style={styles.achievementLabel}>Day Streak</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#9C27B0', '#7B1FA2']}
                            style={styles.achievementCard}
                        >
                            <Ionicons name="trophy" size={32} color="#fff" />
                            <Text style={styles.achievementValue}>{safeStreakData.longest}</Text>
                            <Text style={styles.achievementLabel}>Best Streak</Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#4CAF50', '#388E3C']}
                            style={styles.achievementCard}
                        >
                            <Ionicons name="checkmark-done" size={32} color="#fff" />
                            <Text style={styles.achievementValue}>{safeStreakData.weeklyGoalsMet}</Text>
                            <Text style={styles.achievementLabel}>Goals Met</Text>
                        </LinearGradient>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </Animated.ScrollView>

            <BottomNav /> 
        </View>
    );
}