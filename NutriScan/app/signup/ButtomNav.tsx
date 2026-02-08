import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.includes(path);
  };

  const NavButton = ({ 
    icon, 
    onPress, 
    active 
  }: { 
    icon: any; 
    onPress: () => void; 
    active: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.navButton} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={active ? "#4CAF50" : "#999"} 
        />
      </View>
      {active && <View style={styles.activeDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bottomNav}>
        
        {/* Home */}
        <NavButton 
          icon="home" 
          onPress={() => router.replace("./home")}
          active={isActive("/home")}
        />

        {/* History */}
        <NavButton 
          icon="time" 
          onPress={() => router.push("/signup/history")}
          active={isActive("/history")}
        />

        {/* Scan Button - Center Floating */}
        <TouchableOpacity 
          style={styles.scanButtonContainer}
          onPress={() => router.push("/signup/scan")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            style={styles.scanButton}
          >
            <Ionicons name="camera" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Analytics */}
        <NavButton 
          icon="bar-chart" 
          onPress={() => router.push("/signup/analytics")}
          active={isActive("/analytics")}
        />

        {/* Settings */}
        <NavButton 
          icon="settings" 
          onPress={() => router.push("/signup/setting")}
          active={isActive("/setting")}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    position: "relative",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerActive: {
    backgroundColor: "#E8F5E9",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    position: "absolute",
    bottom: 2,
  },
  scanButtonContainer: {
    position: "absolute",
    top: -30,
    alignSelf: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
});

export default BottomNav;