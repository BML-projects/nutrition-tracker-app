import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 40,
    },

    /* ================= Permission ================= */
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    permissionText: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: "center",
    },

    permissionButton: {
        backgroundColor: "#D37034",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },

    permissionButtonText: {
        color: "#fff",
        fontWeight: "700",
    },

    /* ================= Header ================= */
    header: {
        fontSize: 22,
        fontWeight: "700",
        color: "#000",
        marginLeft: 16,
        marginBottom: 10,
    },

    /* ================= Camera ================= */
    cameraWrapper: {
        alignSelf: "center",
        width: "90%",
        height: "62%",
        borderRadius: 30,
        overflow: "hidden",
        marginBottom: 16,
    },

    camera: {
        flex: 1,
    },

    /* ================= Focus Brackets ================= */
    focusOverlay: {
        ...StyleSheet.absoluteFillObject,
    },

    corner: {
        position: "absolute",
        width: 40,
        height: 40,
        borderColor: "#000",
    },

    topLeft: {
        top: 60,
        left: 40,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },

    topRight: {
        top: 60,
        right: 40,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },

    bottomLeft: {
        bottom: 100,
        left: 40,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },

    bottomRight: {
        bottom: 100,
        right: 40,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },

    /* ================= Tip Overlay ================= */
    tipContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 8,
    },

    tipText: {
        color: "#fff",
        fontSize: 12,
        flex: 1,
    },

    /* ================= Controls ================= */
    controls: {
        alignItems: "center",
        marginBottom: 70,
    },

    instructionPill: {
        backgroundColor: "#D37034",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 14,
    },

    instructionText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },

    /* ================= Bottom Nav ================= */
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
        borderRadius: 14,
    },
});
