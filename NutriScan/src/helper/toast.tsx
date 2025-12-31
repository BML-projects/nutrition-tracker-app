import Toast from "react-native-toast-message";

const BOTTOM_OFFSET = 190; // Adjust according to your button

export const showError = (message: string) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "bottom",
    bottomOffset: BOTTOM_OFFSET,
    keyboardOffset: BOTTOM_OFFSET, // important: stick toast above button
    visibilityTime: 3000,
    autoHide: true,
  });
};

export const showSuccess = (message: string) => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    position: "bottom",
    bottomOffset: BOTTOM_OFFSET,
    keyboardOffset: BOTTOM_OFFSET,
    visibilityTime: 3000,
    autoHide: true,
  });
};
