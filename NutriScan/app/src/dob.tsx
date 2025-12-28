import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles, ITEM_HEIGHT } from "../styles/dob";

// Data Generation
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
// Generates years from 1950 to 2025
const YEARS = Array.from({ length: 76 }, (_, i) => 1950 + i);

export default function DateOfBirth() {
    const router = useRouter();

    const [month, setMonth] = useState("Jan");
    const [day, setDay] = useState(1);
    const [year, setYear] = useState(2000);

    const handleNext = () => {
        console.log(`DOB: ${month} ${day}, ${year}`);
        router.replace("./goal"); // Replace with your actual next route
    };

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Select your date of birth</Text>
                <Text style={styles.subtitle}>we'll use this to create your personalized plan</Text>
            </View>

            {/* 3-COLUMN PICKER SECTION */}
            <View style={styles.pickersContainer}>

                {/* MONTH */}
                <CustomPicker
                    data={MONTHS}
                    initialValueIndex={0}
                    onValueChange={(val) => setMonth(val as string)}
                />

                {/* DAY */}
                <CustomPicker
                    data={DAYS}
                    initialValueIndex={0}
                    onValueChange={(val) => setDay(val as number)}
                />

                {/* YEAR */}
                <CustomPicker
                    data={YEARS}
                    // Index 50 represents year 2000
                    initialValueIndex={50}
                    onValueChange={(val) => setYear(val as number)}
                />
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>NEXT</Text>
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

// --- REUSABLE PICKER COMPONENT ---
interface PickerProps {
    data: (string | number)[];
    initialValueIndex: number;
    onValueChange: (val: string | number) => void;
}

const CustomPicker = ({ data, initialValueIndex, onValueChange }: PickerProps) => {
    const [activeIndex, setActiveIndex] = useState(initialValueIndex);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        setActiveIndex(index);
    };

    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        setActiveIndex(index);
        if (data[index] !== undefined) {
            onValueChange(data[index]);
        }
    };

    return (
        <View style={styles.pickerColumn}>
            <View style={styles.pickerWrapper}>
                {/* Selection Lines Overlay */}
                <View style={styles.selectionLines} pointerEvents="none" />

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false}

                    // --- SNAP LOGIC FIXED ---
                    snapToInterval={ITEM_HEIGHT}
                    // REMOVED snapToAlignment="center" to prevent offset issues
                    decelerationRate="fast"
                    scrollEventThrottle={16}

                    onScroll={onScroll}
                    onMomentumScrollEnd={onMomentumScrollEnd}

                    getItemLayout={(_, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                    initialScrollIndex={initialValueIndex}

                    contentContainerStyle={{
                        paddingVertical: ITEM_HEIGHT,
                    }}

                    renderItem={({ item, index }) => {
                        const isActive = index === activeIndex;
                        return (
                            <View style={styles.itemContainer}>
                                <Text style={[
                                    styles.itemText,
                                    isActive ? styles.activeItemText : styles.inactiveItemText,
                                ]}>
                                    {item}
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
};