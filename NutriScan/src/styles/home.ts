import { StyleSheet } from "react-native";

const GREEN = "#32CD32";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    scrollContent: {
        padding: 16,
        paddingBottom: 120,
    },

    /* ---------- HEADER ---------- */
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

    /* ---------- CALENDAR ---------- */
    calendarRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    dayItem: {
        alignItems: "center",
        width: "13%",
    },

    progressRing: {
        width: 38,
        height: 38,
        borderRadius: 18,
        borderWidth: 3,
        borderColor: GREEN,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
        backgroundColor: "#000",
    },

    progressText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#fff",
    },

    dateText: {
        fontSize: 12,
        color: "#000",
    },

    dayText: {
        fontSize: 11,
        color: "#000",
    },

    activeText: {
        fontWeight: "700",
    },

    /* ---------- MAIN CARD ---------- */
    card: {
        backgroundColor: "#000",
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        height: 200,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    cardTitle: {
        color: "#aaa",
        fontSize: 14,
        fontWeight: "600",
    },

    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },

    calorieNumber: {
        fontSize: 32,
        color: "#fff",
        fontWeight: "700",
        marginLeft: 30,
    },

    calorieLabel: {
        color: "#fff",
        fontSize: 12,
        marginLeft: 20,
    },

    kcalRing: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        borderColor: GREEN,
        justifyContent: "center",
        alignItems: "center",
    },

    kcalText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },

    /* ---------- RECENT ---------- */
    sectionTitle: {
        fontSize: 25,
        fontWeight: "900",
        marginBottom: 10,
        textAlign: "center",
    },

    emptyBox: {
        backgroundColor: "#f2f2f2",
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#999",
        padding: 20,
        alignItems: "center",
        marginBottom: 20,
    },

    emptyTitle: {
        fontWeight: "700",
        marginBottom: 4,
        color: "#000",
    },

    emptySubtitle: {
        color: "#555",
    },

    /* ---------- ADD BUTTON ---------- */
    addButton: {
        width: 58,
        height: 56,
        backgroundColor: GREEN,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },

    /* ---------- BOTTOM NAV ---------- */
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: "#333",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
});
