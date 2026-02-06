import Toast from "react-native-toast-message";

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