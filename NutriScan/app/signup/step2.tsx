import {
      View,
      Text,
      TextInput,
      TouchableOpacity,
    } from "react-native";
    import { useState } from "react";
    import { useRouter } from "expo-router";
    import { authStyles } from "../../styles/authStyles";
    import ProgressDots from "../../components/ProgressDots";
    import AnimatedScreen from "../../components/AnimatedScreen";
    
    export default function Step2() {
      const router = useRouter();
      const [gender, setGender] = useState<string | null>(null);
    
      return (
        <AnimatedScreen>
          <View style={authStyles.container}>
            <ProgressDots total={3} current={2} />
    
            <Text style={authStyles.title}>Body Details</Text>
            <Text style={authStyles.subtitle}>
              Helps calculate calories accurately
            </Text>
    
            {/* Age */}
            <TextInput
              placeholder="Age"
              keyboardType="number-pad"
              maxLength={3}
              style={authStyles.input}
            />
    
            {/* Gender */}
            <View style={authStyles.genderContainer}>
              {["Male", "Female", "Other"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    authStyles.genderCard,
                    gender === item && authStyles.genderCardActive,
                  ]}
                  onPress={() => setGender(item)}
                >
                  <Text style={authStyles.genderText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
    
            {/* Height */}
            <TextInput
              placeholder="Height (cm)"
              keyboardType="number-pad"
              style={authStyles.input}
            />
    
            {/* Weight */}
            <TextInput
              placeholder="Weight (kg)"
              keyboardType="number-pad"
              style={authStyles.input}
            />
    
    <View style={authStyles.navRow}>
  <TouchableOpacity
    style={authStyles.prevButton}
    onPress={() => router.back()}
  >
    <Text style={authStyles.prevButtonText}>Previous</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={authStyles.nextButton}
    onPress={() => router.push("/signup/step3")}
  >
    <Text style={authStyles.nextButtonText}>Next</Text>
  </TouchableOpacity>
</View>
          </View>
        </AnimatedScreen>
      );
    }
    