import { StyleSheet } from "react-native";
// const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    logo: {

        maxWidth: 400,
        maxHeight: 400,
        resizeMode: "contain",
    },

    tagline: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        letterSpacing: 0.5,
        textAlign: "center",
    },
});
