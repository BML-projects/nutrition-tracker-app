import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },

    image: {
        height: height * 0.5,
        width: "100%",
    },

    bottomContainer: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 30,
    },

    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },

    subtitle: {
        color: "#aaa",
        fontSize: 14,
        textAlign: "center",
    },

    dotsContainer: {
        flexDirection: "row",
        marginVertical: 25,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#555",
        marginHorizontal: 5,
    },

    activeDot: {
        backgroundColor: "#fff",
        width: 10,
        height: 10,
    },

    button: {
        backgroundColor: "#4CAF50",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: "center",
        marginBottom: 15,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    loginText: {
        color: "#888",
        fontSize: 13,
    },
});
