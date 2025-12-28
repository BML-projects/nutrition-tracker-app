import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },

    image: {
        height: height * 0.55,
        width: "100%",
    },

    card: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 28,
        paddingTop: 36,
        alignItems: "center",
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#000",
        textAlign: "center",
        marginBottom: 14,
    },

    subtitle: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 40,
    },

    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        width: "70%",
        paddingVertical: 16,
        borderRadius: 30,
        marginTop: 80,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginRight: 10,
    },

    arrow: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        alignSelf: "center",
    },
});
