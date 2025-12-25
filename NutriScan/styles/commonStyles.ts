import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const commonStyles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.backgroundStart,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 22,
  },
});
