import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: 220,
        height: 220,
        resizeMode: "contain",
    },

    tagline: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        letterSpacing: 0.5,
    },
});
