import React from "react";
import { Keyboard, TouchableWithoutFeedback, ScrollView, Platform, KeyboardAvoidingView} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  children: React.ReactNode;
}

/**
 * Wrap your screen in <KeyboardToastWrapper> to:
 * 1. Dismiss keyboard when tapping outside
 * 2. Provide proper KeyboardAvoiding behavior
 */
export const KeyboardToastWrapper: React.FC<Props> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

/**
 * Toast helpers
 */
export const showError = (message: string, bottomOffset = 190) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "bottom",
    bottomOffset,
    keyboardOffset: bottomOffset, // stick above button
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
    keyboardOffset: bottomOffset,
    visibilityTime: 3000,
    autoHide: true,
  });
};
