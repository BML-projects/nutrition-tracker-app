import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSignup } from "../../src/context/SignupContext";
import { ITEM_HEIGHT, styles } from "../../src/styles/dob";

// Data Generation
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 76 }, (_, i) => 1950 + i); // 1950 - 2025

export default function DateOfBirth() {
  const router = useRouter();
  const { data, setData } = useSignup();

  // Initialize state from context
  const initialMonthIndex = MONTHS.indexOf(
    data.dob
      ? new Date(data.dob).toLocaleString("default", { month: "short" })
      : "Jan"
  );

  const initialDay = data.dob ? new Date(data.dob).getDate() : 1;
  const initialYear = data.dob ? new Date(data.dob).getFullYear() : 2000;

  const [month, setMonth] = useState(MONTHS[initialMonthIndex] || "Jan");
  const [day, setDay] = useState(initialDay);
  const [year, setYear] = useState(initialYear);

  const handleNext = () => {
    const dobString = `${year}-${(MONTHS.indexOf(month) + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    setData({ dob: dobString });
    router.push("/signup/gender");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar" size={40} color="#000" />
        </View>
        <Text style={styles.title}>Select your date of birth</Text>
        <Text style={styles.subtitle}>
          We'll use this to create your personalized plan
        </Text>
      </View>

      {/* Date Picker */}
      <View style={styles.pickerSection}>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{`${month} ${day}, ${year}`}</Text>
        </View>

        <View style={styles.pickersContainer}>
          <CustomPicker
            data={MONTHS}
            initialValueIndex={MONTHS.indexOf(month)}
            onValueChange={(val) => setMonth(val as string)}
            label="Month"
          />

          <CustomPicker
            data={DAYS}
            initialValueIndex={day - 1}
            onValueChange={(val) => setDay(val as number)}
            label="Day"
          />

          <CustomPicker
            data={YEARS}
            initialValueIndex={YEARS.indexOf(year)}
            onValueChange={(val) => setYear(val as number)}
            label="Year"
          />
        </View>
      </View>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#000", "#2a2a2a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface PickerProps {
  data: (string | number)[];
  initialValueIndex: number;
  onValueChange: (val: string | number) => void;
  label: string;
}

const CustomPicker = ({
  data,
  initialValueIndex,
  onValueChange,
  label,
}: PickerProps) => {
  const [activeIndex, setActiveIndex] = useState(initialValueIndex);
  const listRef = useRef<FlatList>(null);

  const scrollToIndex = (index: number) => {
    if (index < 0) index = 0;
    if (index >= data.length) index = data.length - 1;

    listRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    setActiveIndex(index);
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);

    setActiveIndex(index);
    scrollToIndex(index); // ✅ force perfect snap in center

    if (data[index] !== undefined) {
      onValueChange(data[index]);
    }
  };

  return (
    <View style={styles.pickerColumn}>
      <Text style={styles.pickerLabel}>{label}</Text>

      <View style={styles.pickerWrapper}>
        <View style={styles.selectionIndicator} pointerEvents="none" />

        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"   // ✅ important
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
  paddingVertical: (250 / 2) - (ITEM_HEIGHT / 2),
}}

          renderItem={({ item, index }) => {
            const isActive = index === activeIndex;
            const distance = Math.abs(index - activeIndex);
            const opacity = Math.max(0.3, 1 - distance * 0.3);

            return (
              <View style={styles.itemContainer}>
                <Text
                  style={[
                    styles.itemText,
                    isActive && styles.activeItemText,
                    { opacity },
                  ]}
                >
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
