import { StyleSheet } from "react-native";

// 1. Export this so the .tsx file can use it for calculations
export const ITEM_HEIGHT = 50;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 24,
        paddingTop: 60,
    },

    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
        lineHeight: 20,
    },

    metricBadge: {
        backgroundColor: "#D37034",
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 40,
        marginTop: 10,
    },
    metricText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },

    pickersContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    pickerColumn: {
        alignItems: "center",
        width: "45%",
    },
    pickerLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
        marginBottom: 15,
    },

    pickerWrapper: {
        height: ITEM_HEIGHT * 3,
        width: "100%",
        position: "relative",
    },

    selectionLines: {
        position: "absolute",
        top: ITEM_HEIGHT,
        height: ITEM_HEIGHT,
        width: "100%",
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: "#000",
        zIndex: 10,
    },

    // --- NEW: This centers the text container vertically ---
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
    },

    itemText: {
        fontSize: 18,
        // --- NEW: These two lines fix the Android alignment issue ---
        textAlignVertical: "center",
        includeFontPadding: false,
    },

    activeItemText: {
        color: "#000",
        fontWeight: "700",
        fontSize: 22,
    },
    inactiveItemText: {
        color: "#aaa",
        fontSize: 18,
    },

    footer: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 30,
    },
    nextButton: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center", // Ensures arrow and text are aligned
        backgroundColor: "#000",
        width: "70%",
        paddingVertical: 16,
        borderRadius: 30,
        marginBottom: 80,
    },
    nextButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginRight: 10,
    },

    arrow: {
        marginLeft: 5,
    },
});