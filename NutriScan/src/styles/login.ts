import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingTop: height * 0.10,
        justifyContent: "flex-start",
    },

    title: {
        fontSize: 40,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,

    },

    subtitle: {
        textAlign: "center",
        color: "#555",
        marginBottom: 40,
        fontSize: 14,
    },

    linkText: {
        color: "#2434E8",
        fontWeight: "600",
    },

    input: {
        backgroundColor: "#F3F3F3",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 14,
        marginBottom: 15,
    },

    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F3F3",
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 25,
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 14,
    },

    loginButton: {
        backgroundColor: "#2434E8",
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: "center",
        marginBottom: 25,
    },

    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#E0E0E0",
    },

    orText: {
        marginHorizontal: 10,
        color: "#888",
        fontSize: 13,
    },

    /* GOOGLE BUTTON */
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        backgroundColor: "#2434E8",
        paddingVertical: 14,
        borderRadius: 25,
    },

    googleIcon: {
        width: 15,
        height: 15,
        marginRight: 10,
    },

    googleText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
