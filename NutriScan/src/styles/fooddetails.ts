import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },

    imageWrapper: {
        position: "relative",
    },

    image: {
        width: "100%",
        height: 240,
        resizeMode: "cover",
    },

    backButton: {
        position: "absolute",
        top: 40,
        left: 16,
        backgroundColor: "#FFF",
        padding: 8,
        borderRadius: 20,
        elevation: 4,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        margin: 16,
    },

    card: {
        backgroundColor: "#F8F8F8",
        marginHorizontal: 16,
        borderRadius: 14,
        padding: 12,
    },

    nutritionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        alignItems: "center",
    },

    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    rowLabel: {
        fontSize: 14,
        color: "#444",
    },

    rowValue: {
        fontSize: 15,
        fontWeight: "600",
    },

    analysisText: {
        fontSize: 13,
        color: "#555",
        margin: 16,
        lineHeight: 18,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginHorizontal: 16,
        marginBottom: 8,
    },

    ingredientCard: {
        backgroundColor: "#F8F8F8",
        marginHorizontal: 16,
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
    },

    ingredientTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
    },

    macroRow: {
        flexDirection: "row",
        gap: 16,
    },

    macroItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    macroText: {
        fontSize: 12,
        color: "#555",
    },

    updateButton: {
        backgroundColor: "#E9782A",
        margin: 16,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
    },

    updateText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
