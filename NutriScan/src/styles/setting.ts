import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    /* ================= Screen ================= */
    screen: {
        flex: 1,
        backgroundColor: "#fff",
    },

    container: {
        padding: 16,
        paddingBottom: 90,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 12,
        marginTop: 20,
    },

    section: {
        marginBottom: 20,
    },

    /* ================= Section Badge ================= */
    sectionBadge: {
        backgroundColor: "#D37034",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 8,

        color: "#000",
        fontWeight: "600",
    },

    /* ================= Cards ================= */
    card: {
        backgroundColor: "#E5E5E5",
        borderRadius: 16,
        padding: 14,
    },

    cardTitle: {
        fontSize: 14,
        fontWeight: "700",
    },

    cardSub: {
        fontSize: 12,
        color: "#666",
        marginBottom: 10,
    },

    /* ================= Rows ================= */
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },

    rowLabel: {
        fontSize: 14,
    },

    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    valueText: {
        fontWeight: "600",
    },

    /* ================= Appearance ================= */
    appearancePill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#D37034",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        gap: 4,
    },

    appearanceText: {
        color: "#000",
        fontWeight: "600",
    },

    optionBox: {
        backgroundColor: "#f2f2f2",
        borderRadius: 12,
        marginTop: 6,
    },

    optionRow: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },

    optionText: {
        fontSize: 13,
    },

    /* ================= Profile ================= */
    profileCard: {
        backgroundColor: "#E5E5E5",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        marginBottom: 10,
    },

    avatar: {
        backgroundColor: "#D37034",
        height: 70,
        width: 70,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },

    username: {
        fontSize: 15,
        fontWeight: "700",
    },

    email: {
        fontSize: 12,
        color: "#666",
    },

    menuItem: {
        backgroundColor: "#E5E5E5",
        borderRadius: 14,
        padding: 14,

        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
    },

    menuText: {
        fontWeight: "900",
    },

    /* ================= Bottom Navigation ================= */
    nav: {
        position: "absolute",
        bottom: 0,

        height: 80,
        width: "100%",
        backgroundColor: "#333",

        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

    navActive: {
        backgroundColor: "#32CD32",
        padding: 10,
        borderRadius: 12,
    },
});
