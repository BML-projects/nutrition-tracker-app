import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const onboardingStyles = StyleSheet.create({
  image: {
    width: 280,
    height: 280,
    resizeMode: "cover",
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 18,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: COLORS.primary,
      borderRadius: 30,
      position: "absolute",       // absolute positioning
      bottom: 120,                 // distance from bottom of the screen
      marginHorizontal: 80,       // gap from left and right edges
      alignSelf: "center",        // center horizontally within available space
    }
    
});
