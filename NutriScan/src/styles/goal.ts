import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 30,
        justifyContent: "space-between",
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#000",
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 14,
        color: "#777",
        marginBottom: 30,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.8,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#000",
    },

    optionText: {
        fontSize: 16,
        color: "#000",
    },

    button: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        width: "70%",
        paddingVertical: 16,
        borderRadius: 30,
        marginBottom: 80,
    },

    buttonDisabled: {
        backgroundColor: "#ccc", // greyed out
    },

    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginRight: 10,
    },

    arrow: {
        marginLeft: 5,
    },
});