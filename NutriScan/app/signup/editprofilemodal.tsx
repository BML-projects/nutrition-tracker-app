import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import {
    calculateBMI,
    calculateAge,
    calculateBMR,
    calculateWeightPlan,
    WeightPlan
} from '@/src/utils/calculations';

interface EditTargetWeightModalProps {
    visible: boolean;
    onClose: () => void;
    userData: {
        weight: number;
        height: number;
        dob: string;
        gender: string;
        goal: string;
        targetWeight?: number;
        timeline?: 'fast' | 'moderate' | 'slow';
    };
    onSave: (data: { targetWeight: number; timeline: 'fast' | 'moderate' | 'slow' }) => Promise<void>;
}

export default function EditTargetWeightModal({
    visible,
    onClose,
    userData,
    onSave,
}: EditTargetWeightModalProps) {
    const [targetWeight, setTargetWeight] = useState(userData.targetWeight?.toString() || '');
    const [timeline, setTimeline] = useState<'fast' | 'moderate' | 'slow'>(userData.timeline || 'moderate');
    const [weightPlan, setWeightPlan] = useState<WeightPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);

    const currentWeight = userData.weight || 0;
    const height = userData.height || 0;
    const goal = userData.goal || 'maintain';

    // Calculate weight plan when target weight or timeline changes
    useEffect(() => {
        if (targetWeight && parseFloat(targetWeight) > 0 && userData.dob) {
            calculatePlan();
        }
    }, [targetWeight, timeline]);

    const calculatePlan = () => {
        setCalculating(true);
        try {
            const target = parseFloat(targetWeight);
            const current = currentWeight;
            const difference = Math.abs(target - current);

            if (difference === 0) {
                setWeightPlan(null);
                setCalculating(false);
                return;
            }

            // Validate goal direction
            if (goal === 'lose' && target >= current) {
                setWeightPlan(null);
                setCalculating(false);
                return;
            }

            if (goal === 'gain' && target <= current) {
                setWeightPlan(null);
                setCalculating(false);
                return;
            }

            // Calculate BMR
            const age = calculateAge(userData.dob);
            const bmr = calculateBMR(height, currentWeight, age, userData.gender);

            // Calculate weight plan
            const plan = calculateWeightPlan(
                current,
                target,
                goal as 'lose' | 'gain',
                timeline,
                bmr,
                'moderate'
            );

            setWeightPlan(plan);
        } catch (error) {
            console.error('Error calculating plan:', error);
            setWeightPlan(null);
        } finally {
            setCalculating(false);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!targetWeight || parseFloat(targetWeight) <= 0) {
            Alert.alert('Required', 'Please enter your target weight');
            return;
        }

        const target = parseFloat(targetWeight);

        if (target < 30 || target > 300) {
            Alert.alert('Invalid Weight', 'Please enter a realistic target weight (30-300 kg)');
            return;
        }

        // Check if target makes sense with goal
        if (goal === 'lose' && target >= currentWeight) {
            Alert.alert('Invalid Target', 'For weight loss, target must be less than current weight.');
            return;
        }

        if (goal === 'gain' && target <= currentWeight) {
            Alert.alert('Invalid Target', 'For weight gain, target must be more than current weight.');
            return;
        }

        if (!weightPlan) {
            Alert.alert('Error', 'Please wait for plan calculation');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                targetWeight: target,
                timeline,
            });
            Alert.alert('✓ Success', 'Target weight updated successfully!');
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update target weight');
        } finally {
            setLoading(false);
        }
    };

    const weightDifference = targetWeight ? Math.abs(parseFloat(targetWeight) - currentWeight) : 0;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit Target Weight</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Current Stats */}
                        <View style={styles.statsCard}>
                            <Text style={styles.statsTitle}>Current Stats</Text>
                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Ionicons name="scale-outline" size={24} color="#D37034" />
                                    <Text style={styles.statLabel}>Current</Text>
                                    <Text style={styles.statValue}>{currentWeight} kg</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Ionicons name="trending-down" size={24} color="#D37034" />
                                    <Text style={styles.statLabel}>Goal</Text>
                                    <Text style={styles.statValue}>
                                        {goal === 'lose' ? 'Lose' : goal === 'gain' ? 'Gain' : 'Maintain'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Target Weight Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Target Weight (kg)</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="trophy-outline" size={24} color="#D37034" style={{ marginRight: 12 }} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter target weight"
                                    placeholderTextColor="#999"
                                    value={targetWeight}
                                    onChangeText={setTargetWeight}
                                    keyboardType="decimal-pad"
                                    maxLength={5}
                                />
                                <Text style={styles.unit}>kg</Text>
                            </View>

                            {weightDifference > 0 && (
                                <View style={styles.differenceCard}>
                                    <Ionicons
                                        name={goal === 'lose' ? 'arrow-down-circle' : 'arrow-up-circle'}
                                        size={20}
                                        color={goal === 'lose' ? '#3b82f6' : '#f59e0b'}
                                    />
                                    <Text style={styles.differenceText}>
                                        {weightDifference.toFixed(1)} kg to {goal === 'lose' ? 'lose' : 'gain'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Timeline Selection */}
                        <View style={styles.timelineSection}>
                            <Text style={styles.label}>Choose Your Pace</Text>

                            {[
                                {
                                    value: 'fast',
                                    label: 'Fast',
                                    description: goal === 'lose' ? '~1 kg/week' : '~0.5 kg/week',
                                    icon: 'flash',
                                    color: '#ef4444'
                                },
                                {
                                    value: 'moderate',
                                    label: 'Moderate (Recommended)',
                                    description: goal === 'lose' ? '~0.5 kg/week' : '~0.35 kg/week',
                                    icon: 'walk',
                                    color: '#f59e0b'
                                },
                                {
                                    value: 'slow',
                                    label: 'Slow & Steady',
                                    description: '~0.25 kg/week',
                                    icon: 'hourglass',
                                    color: '#10b981'
                                },
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.timelineOption,
                                        timeline === option.value && styles.timelineOptionActive,
                                    ]}
                                    onPress={() => setTimeline(option.value as any)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.timelineIconContainer, { backgroundColor: option.color + '20' }]}>
                                        <Ionicons name={option.icon as any} size={24} color={option.color} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <Text style={[
                                            styles.timelineLabel,
                                            timeline === option.value && styles.timelineLabelActive
                                        ]}>
                                            {option.label}
                                        </Text>
                                        <Text style={styles.timelineDescription}>{option.description}</Text>
                                    </View>
                                    <View style={styles.radioOuter}>
                                        {timeline === option.value && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Weight Plan Preview */}
                        {calculating && (
                            <View style={styles.calculatingCard}>
                                <ActivityIndicator size="small" color="#D37034" />
                                <Text style={styles.calculatingText}>Calculating plan...</Text>
                            </View>
                        )}

                        {weightPlan && !calculating && (
                            <View style={styles.planCard}>
                                <View style={styles.planHeader}>
                                    <Ionicons name="calendar-outline" size={24} color="#D37034" />
                                    <Text style={styles.planTitle}>Your New Plan</Text>
                                </View>

                                <View style={styles.planRow}>
                                    <View style={styles.planItem}>
                                        <Text style={styles.planLabel}>Duration</Text>
                                        <Text style={styles.planValue}>{weightPlan.estimatedWeeks} weeks</Text>
                                    </View>
                                    <View style={styles.planDivider} />
                                    <View style={styles.planItem}>
                                        <Text style={styles.planLabel}>Weekly Rate</Text>
                                        <Text style={styles.planValue}>{weightPlan.weeklyRate} kg</Text>
                                    </View>
                                </View>

                                <View style={styles.caloriesInfo}>
                                    <Ionicons name="nutrition-outline" size={20} color="#D37034" />
                                    <Text style={styles.caloriesLabel}>Daily Calories</Text>
                                    <Text style={styles.caloriesValue}>
                                        {weightPlan.dailyCalories.toLocaleString()}
                                    </Text>
                                </View>

                                <View style={styles.completionDate}>
                                    <Ionicons name="flag-outline" size={18} color="#10b981" />
                                    <Text style={styles.completionText}>
                                        Target: {weightPlan.estimatedCompletionDate}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[styles.saveButton, (loading || !weightPlan) && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={loading || !weightPlan}
                        >
                            <LinearGradient
                                colors={weightPlan && !loading ? ['#D37034', '#b85a28'] : ['#d0d0d0', '#b0b0b0']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveButtonGradient}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                                        <Text style={styles.saveButtonText}>Update Target Weight</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        padding: 20,
    },
    statsCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#ddd',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginTop: 4,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    unit: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    differenceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    differenceText: {
        fontSize: 14,
        color: '#1976d2',
        fontWeight: '500',
        marginLeft: 8,
    },
    timelineSection: {
        marginBottom: 24,
    },
    timelineOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    timelineOptionActive: {
        borderColor: '#D37034',
        backgroundColor: '#fff',
    },
    timelineIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    timelineContent: {
        flex: 1,
    },
    timelineLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    timelineLabelActive: {
        color: '#D37034',
        fontWeight: '600',
    },
    timelineDescription: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#D37034',
    },
    calculatingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 24,
    },
    calculatingText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
    },
    planCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    planHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    planTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginLeft: 8,
    },
    planRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    planItem: {
        flex: 1,
        alignItems: 'center',
    },
    planDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#ddd',
    },
    planLabel: {
        fontSize: 12,
        color: '#666',
    },
    planValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginTop: 4,
    },
    caloriesInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    caloriesLabel: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    caloriesValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#D37034',
    },
    completionDate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
    },
    completionText: {
        fontSize: 13,
        color: '#2e7d32',
        marginLeft: 6,
        fontWeight: '500',
    },
    saveButton: {
        marginBottom: 20,
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});