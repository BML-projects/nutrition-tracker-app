import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSignup } from "../../src/context/SignupContext";
import { ITEM_HEIGHT, styles } from "../../src/styles/dob";

// Data Generation
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 76 }, (_, i) => 1950 + i); // 1950 - 2025

export default function DateOfBirth() {
    const router = useRouter();
    const { data, setData } = useSignup();

    // Initialize state from context
    const initialMonthIndex = MONTHS.indexOf(data.dob ? new Date(data.dob).toLocaleString("default", { month: "short" }) : "Jan");
    const initialDay = data.dob ? new Date(data.dob).getDate() : 1;
    const initialYear = data.dob ? new Date(data.dob).getFullYear() : 2000;

    const [month, setMonth] = useState(MONTHS[initialMonthIndex] || "Jan");
    const [day, setDay] = useState(initialDay);
    const [year, setYear] = useState(initialYear);

    const handleNext = () => {
        const dobString = `${year}-${(MONTHS.indexOf(month) + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        setData({ dob: dobString });
        router.push("/signup/gender");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select your date of birth</Text>
                <Text style={styles.subtitle}>{`we'll use this to create your personalized plan`}</Text>
            </View>

            <View style={styles.pickersContainer}>
                <CustomPicker
                    data={MONTHS}
                    initialValueIndex={MONTHS.indexOf(month)}
                    onValueChange={(val) => setMonth(val as string)}
                />
                <CustomPicker
                    data={DAYS}
                    initialValueIndex={day - 1}
                    onValueChange={(val) => setDay(val as number)}
                />
                <CustomPicker
                    data={YEARS}
                    initialValueIndex={YEARS.indexOf(year)}
                    onValueChange={(val) => setYear(val as number)}
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
                <View style={styles.selectionLines} pointerEvents="none" />
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
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
                                <Text style={[styles.itemText, isActive ? styles.activeItemText : styles.inactiveItemText]}>
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
