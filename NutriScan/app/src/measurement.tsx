import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles, ITEM_HEIGHT } from "../styles/measurement";

// Generate data arrays
const HEIGHTS = Array.from({ length: 250 }, (_, i) => i + 1);
const WEIGHTS = Array.from({ length: 150 }, (_, i) => i + 1);

export default function Measurements() {
    const router = useRouter();

    const [height, setHeight] = useState(165);
    const [weight, setWeight] = useState(54);

    const handleNext = () => {
        console.log(`Selected Height: ${height} cm, Weight: ${weight} kg`);
        router.replace("./activitylevel");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Enter your body measurements</Text>
                <Text style={styles.subtitle}>we'll use this to create your personalized plan</Text>
            </View>

            <View style={styles.metricBadge}>
                <Text style={styles.metricText}>Metric</Text>
            </View>

            <View style={styles.pickersContainer}>
                <CustomPicker
                    label="Height"
                    data={HEIGHTS}
                    unit="cm"
                    initialValue={165}
                    onValueChange={setHeight}
                />
                <CustomPicker
                    label="Weight"
                    data={WEIGHTS}
                    unit="kg"
                    initialValue={54}
                    onValueChange={setWeight}
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                    <Ionicons
                        name="arrow-forward"
                        size={25}
                        color="#fff"
                        style={styles.arrow}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

interface PickerProps {
    label: string;
    data: number[];
    unit: string;
    initialValue: number;
    onValueChange: (val: number) => void;
}

const CustomPicker = ({ label, data, unit, initialValue, onValueChange }: PickerProps) => {
    const [activeIndex, setActiveIndex] = useState(initialValue - 1);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        setActiveIndex(index);
        if (data[index]) {
            onValueChange(data[index]);
        }
    };

    return (
        <View style={styles.pickerColumn}>
            <Text style={styles.pickerLabel}>{label}</Text>

            <View style={styles.pickerWrapper}>
                <View style={styles.selectionLines} pointerEvents="none" />

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false}

                    // --- THE FIX IS HERE ---
                    snapToInterval={ITEM_HEIGHT}
                    snapToAlignment="center" // <--- Forces it to stop EXACTLY in the middle
                    decelerationRate="fast"
                    scrollEventThrottle={16}

                    onScroll={onScroll}
                    getItemLayout={(_, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                    initialScrollIndex={initialValue - 1}
                    contentContainerStyle={{
                        paddingVertical: ITEM_HEIGHT,
                    }}
                    renderItem={({ item, index }) => {
                        const isActive = index === activeIndex;
                        return (
                            // Using the style from file which has justifyContent: center
                            <View style={styles.itemContainer}>
                                <Text style={[
                                    styles.itemText,
                                    isActive ? styles.activeItemText : styles.inactiveItemText
                                ]}>
                                    {item} <Text style={{ fontSize: 14 }}>{unit}</Text>
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
};