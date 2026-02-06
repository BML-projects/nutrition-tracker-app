import React, { useRef } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";

interface KeyboardAwareContainerProps {
  children: React.ReactNode;
  /** Use ScrollView for forms WITHOUT lists. Set to false if you have FlatList/SectionList inside */
  enableScroll?: boolean;
  contentContainerStyle?: any;
  style?: any;
}

export const KeyboardAwareContainer: React.FC<KeyboardAwareContainerProps> = ({
  children,
  enableScroll = true,
  contentContainerStyle,
  style,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // 1. Web Implementation
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, style]}>
        {enableScroll ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.scrollContent, contentContainerStyle]}>
            {children}
          </View>
        )}
      </View>
    );
  }

  // 2. Mobile (iOS/Android) Implementation
  const content = enableScroll ? (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled" // Crucial: allows tapping inputs while keyboard is up
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      keyboardDismissMode="interactive"
      nestedScrollEnabled={true}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, contentContainerStyle]}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      // Android works best with "height", iOS works best with "padding"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // Adjust this offset if you have a header or bottom tabs
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback 
        onPress={Keyboard.dismiss} 
        accessible={false} // Prevents this wrapper from blocking child input focus
      >
        <View style={styles.innerWrapper}>
          {content}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Toast Utilities
export const showError = (message: string, bottomOffset = 190) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "bottom",
    bottomOffset,
    visibilityTime: 3000,
    autoHide: true,
  });
};

export const showSuccess = (message: string, bottomOffset = 190) => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    position: "bottom",
    bottomOffset,
    visibilityTime: 3000,
    autoHide: true,
  });
};

export const showInfo = (message: string, bottomOffset = 190) => {
  Toast.show({
    type: "info",
    text1: "Info",
    text2: message,
    position: "bottom",
    bottomOffset,
    visibilityTime: 3000,
    autoHide: true,
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});