import { StyleSheet } from "react-native";

const GREEN = "#32CD32"; // Lime Green accent color

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    scrollContent: {
        padding: 16,
        // Add padding at the bottom so the last item isn't hidden behind the nav bar
        paddingBottom: 100,
    },

    // Header section with the logo
    logoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },

    logoImage: {
        width: 90,
        height: 90,
        resizeMode: "contain",
        marginTop: 10,
    },

    // The weekly calendar strip
    calendarRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    dayItem: {
        alignItems: "center",
        width: "13%", // Fits 7 days across the screen
    },

    // The small green/black ring above the date
    progressRing: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 3,
        borderColor: GREEN,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
        backgroundColor: "#000",
    },

    progressText: {
        fontSize: 9,
        fontWeight: "700",
        color: "#fff",
    },

    dateText: {
        fontSize: 13,
        color: "#000",
        fontWeight: "600",
        marginBottom: 2,
    },

    dayText: {
        fontSize: 10,
        color: "#666",
        textTransform: "uppercase",
    },

    // Style for the currently selected day
    activeText: {
        fontWeight: "900",
        color: "#000",
    },

    // The main black card showing calories
    card: {
        backgroundColor: "#000",
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        minHeight: 180,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },

    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        maxWidth: "80%",
    },

    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
    },

    calorieNumber: {
        fontSize: 42,
        color: "#fff",
        fontWeight: "700",
        marginBottom: 4,
    },

    calorieLabel: {
        color: "#aaa",
        fontSize: 14,
        fontWeight: "500",
    },

    // Visual ring inside the card
    kcalRing: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        borderWidth: 3,
        borderColor: GREEN,
        justifyContent: "center",
        alignItems: "center",
    },

    kcalText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },

    // Recent Activities section
    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#000",
        marginBottom: 15,
        textAlign: "center",
    },

    // Dashed box shown when no meals are recorded
    emptyBox: {
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#aaa",
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: "center",
        marginBottom: 20,
    },

    emptyTitle: {
        fontWeight: "700",
        fontSize: 14,
        marginBottom: 6,
        color: "#000",
    },

    emptySubtitle: {
        color: "#666",
        fontSize: 14,
    },

    // Styling for a single activity item (if data exists)
    activityItem: {
        backgroundColor: "#F9F9F9",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: GREEN,
    },

    // Floating green add button
    addButton: {
        width: 60,
        height: 60,
        backgroundColor: GREEN,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    // Fixed bottom navigation bar
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 85,
        backgroundColor: "#333",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: 10,
    },
});