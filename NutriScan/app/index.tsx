import { Text, View, Image, Dimensions } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={require("../assets/images/landing.jpg")}
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height
        }} />
      <View>
        <Text>Diet Planner</Text>
      </View>
    </View>
  );
}
