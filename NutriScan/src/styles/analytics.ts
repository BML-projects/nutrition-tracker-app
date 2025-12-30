import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    /* ================= Screen Layout ================= */
    screen: {
        flex: 1,
        backgroundColor: "#fff",
    },

    container: {
        padding: 16,
        // Add padding at bottom so navigation bar doesn't cover content
        paddingBottom: 90,
        marginTop: 25,
    },

    title: {
        fontSize: 28, // Large bold title
        fontWeight: "800",
        color: "#000",
        marginBottom: 20,
    },

    /* ================= Card Styling ================= */
    // The grey container blocks for each section
    card: {
        backgroundColor: "#E5E5E5",
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
        marginLeft: 5,
    },

    // Used for titles that have an icon next to them
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 5,
    },

    /* ================= Toggle Switch (Segmented Control) ================= */
    // The pill-shaped container
    segment: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        overflow: "hidden", // Keeps child corners rounded
        marginBottom: 15,
    },

    // Individual button inside the toggle
    segmentBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "#ccc",
    },

    // The orange background for the selected option
    segmentActive: {
        backgroundColor: "#D37034",
    },

    segmentText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#000",
    },

    // Text turns white when selected
    segmentTextActive: {
        color: "#fff",
    },

    /* ================= Chart Grid ================= */
    // Container for the visual graph
    chart: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 120,
        alignItems: "flex-end", // Aligns bars to bottom
        borderWidth: 1,
        borderColor: "#aaa",
        paddingTop: 10,
        backgroundColor: "#E5E5E5",
    },

    // One vertical slice of the chart
    chartCol: {
        flex: 1,
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        borderRightWidth: 0.5,
        borderRightColor: "#ccc", // Vertical grid lines
    },

    // The horizontal line representing data trend
    chartBar: {
        width: "100%",
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        marginBottom: 30, // Pushes the line up from the bottom
    },

    chartLabel: {
        fontSize: 10,
        marginTop: 5,
        color: "#555",
    },

    /* ================= Goal Status Box ================= */
    // The box with the dashed border
    dashedBox: {
        borderWidth: 1.5,
        borderColor: "#999",
        borderStyle: "dashed",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        marginTop: 5,
    },

    centerText: {
        color: "#666",
        fontSize: 13,
        textAlign: "center",
        fontWeight: "600",
    },

    /* ================= Weekly Progress Table ================= */
    subTitle: {
        fontSize: 11,
        color: "#555",
        textAlign: "center",
        marginBottom: 15,
    },

    // A single row in the data table
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ccc",
        paddingBottom: 4,
    },

    bold: {
        fontWeight: "700",
    },

    /* ================= Bottom Navigation ================= */
    nav: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 80,
        backgroundColor: "#333", // Dark Grey
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: 10,
    },

    // The green square for the active tab
    navActive: {
        backgroundColor: "#32CD32",
        padding: 10,
        borderRadius: 12,
    },
});