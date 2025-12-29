import { StyleSheet } from "react-native";

export const ITEM_HEIGHT = 50;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 24,
        paddingTop: 60,
    },

    /* --- HEADER --- */
    header: { marginBottom: 50 },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
        textAlign: "left",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "left",
        lineHeight: 20,
    },

    /* --- PICKER CONTAINER --- */
    pickersContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    pickerColumn: {
        alignItems: "center",
        width: "30%", // 3 Columns
    },

    /* --- WHEEL MECHANISM --- */
    pickerWrapper: {
        height: ITEM_HEIGHT * 3, // Shows exactly 3 items
        width: "100%",
        position: "relative",
    },

    // Black Lines Overlay
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

    /* --- ITEM STYLING (Centering Logic) --- */
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: "center", // Vertically centers the text container
        alignItems: "center",     // Horizontally centers the text
    },
    itemText: {
        fontSize: 18,
        // Crucial for vertical alignment consistency
        textAlignVertical: 'center',
        includeFontPadding: false,
        fontWeight: "600",
    },
    activeItemText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 20,
    },
    inactiveItemText: {
        color: "#ccc",
        fontSize: 18,
    },

    /* --- FOOTER --- */
    footer: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 30,
    },
    nextButton: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
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