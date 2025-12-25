import { View } from "react-native";
import { authStyles } from "../styles/authStyles";
import { COLORS } from "../styles/colors";

type Props = {
  total: number;
  current: number;
};

export default function ProgressDots({ total, current }: Props) {
  return (
    <View style={authStyles.progressContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            authStyles.progressDot,
            current === index + 1 && authStyles.progressDotActive,
          ]}
        />
      ))}
    </View>
  );
}
