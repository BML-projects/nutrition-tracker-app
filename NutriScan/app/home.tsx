import { Text, View } from "react-native";
import { splashStyles as styles } from "../styles/splashStyles";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NutriScan</Text>
    </View>
  );
}
