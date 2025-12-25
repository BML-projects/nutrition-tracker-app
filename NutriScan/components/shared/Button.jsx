import { Text, TouchableOpacity } from "react-native";
import Colors from "../../shared/Colors";

export default function Button({ title, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: Colors.PRIMARY,
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    color: Colors.WHITE,
                    fontSize: 18,
                    fontWeight: "bold",
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
