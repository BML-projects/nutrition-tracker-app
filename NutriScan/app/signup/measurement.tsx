import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ITEM_HEIGHT, styles } from "../../src/styles/measurement";
import { useSignup } from "@/src/context/SignupContext";

// Generate data arrays
const HEIGHTS = Array.from({ length: 250 }, (_, i) => i + 1);
const WEIGHTS = Array.from({ length: 150 }, (_, i) => i + 1);

export default function Measurements() {
  const router = useRouter();
  const { setData } = useSignup();

  const [height, setHeight] = useState<number>(165);
  const [weight, setWeight] = useState<number>(54);

  const handleNext = () => {
    // ✅ Save to global signup context
    setData({
      height,
      weight,
    });

    console.log("Saved measurements:", { height, weight });

    router.replace("/signup/goal");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter your body measurements</Text>
        <Text style={styles.subtitle}>
          We will use this to create your personalized plan
        </Text>
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

/* =======================
   Custom Picker Component
======================= */

interface PickerProps {
  label: string;
  data: number[];
  unit: string;
  initialValue: number;
  onValueChange: (val: number) => void;
}

const CustomPicker = ({
  label,
  data,
  unit,
  initialValue,
  onValueChange,
}: PickerProps) => {
  const [activeIndex, setActiveIndex] = useState(initialValue - 1);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    setActiveIndex(index);

    if (data[index] !== undefined) {
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
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={onScroll}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          initialScrollIndex={initialValue - 1}
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
          renderItem={({ item, index }) => {
            const isActive = index === activeIndex;
            return (
              <View style={styles.itemContainer}>
                <Text
                  style={[
                    styles.itemText,
                    isActive
                      ? styles.activeItemText
                      : styles.inactiveItemText,
                  ]}
                >
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
