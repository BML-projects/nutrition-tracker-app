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
  StatusBar,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
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
    setData({
      height,
      weight,
    });

    console.log("Saved measurements:", { height, weight });

    router.replace("/signup/goal");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="fitness" size={40} color="#000" />
        </View>
        <Text style={styles.title}>Enter your measurements</Text>
        <Text style={styles.subtitle}>
          We will use this to create your personalized plan
        </Text>
      </View>

      {/* Metric Badge */}
      <View style={styles.metricBadge}>
        <Ionicons name="analytics" size={16} color="#000" />
        <Text style={styles.metricText}>Metric System</Text>
      </View>

      {/* Values Display */}
      <View style={styles.valuesDisplay}>
        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>Height</Text>
          <Text style={styles.valueNumber}>{height}</Text>
          <Text style={styles.valueUnit}>cm</Text>
        </View>
        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>Weight</Text>
          <Text style={styles.valueNumber}>{weight}</Text>
          <Text style={styles.valueUnit}>kg</Text>
        </View>
      </View>

      {/* Pickers */}
      <View style={styles.pickersContainer}>
        <CustomPicker
          label="Height (cm)"
          data={HEIGHTS}
          unit="cm"
          initialValue={165}
          onValueChange={setHeight}
        />

        <CustomPicker
          label="Weight (kg)"
          data={WEIGHTS}
          unit="kg"
          initialValue={54}
          onValueChange={setWeight}
        />
      </View>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#000', '#2a2a2a']}
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
        <View style={styles.selectionIndicator} pointerEvents="none" />

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
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
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
                    { opacity }
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