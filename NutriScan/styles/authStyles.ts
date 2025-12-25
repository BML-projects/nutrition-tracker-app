import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
  },

  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
  },

  inputContainer: {
    marginTop: 24,
  },

  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 14,
    marginTop: 16, 
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  linkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  button: {
    height: 54,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.9,
    textAlign:'center',
  },

  outlineButton: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },

  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },

  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gray,
    marginHorizontal: 6,
  },

  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 18,
  },



  genderContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 16,
      
    },
    
    genderCard: {
      flex: 1,
      paddingVertical: 16,
      marginHorizontal: 6,
      borderRadius: 16,
      backgroundColor: COLORS.card,
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: COLORS.card,
    },
    
    genderCardActive: {
      borderColor: COLORS.primary,
      // backgroundColor: "rgba(56,189,248,0.15)",
      backgroundColor: COLORS.primary,
    },
    
    genderText: {
      color: COLORS.white,
      fontWeight: "600",
    },

    navRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 24,
    },
    
    prevButton: {
      flex: 1,
      height: 52,
      borderRadius: 26,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    
    prevButtonText: {
      color: COLORS.primary,
      fontWeight: "600",
    },
    
    nextButton: {
      flex: 1,
      height: 52,
      borderRadius: 26,
      backgroundColor: COLORS.primary,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },
    
    nextButtonText: {
      color: COLORS.white,
      fontWeight: "700",
    },

    goalBox: {
      height: 52,                 // same as input height
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
      backgroundColor: "transparent",
      marginTop: 16, 
      justifyContent: "center",   // vertical center
      alignItems: "center",       // horizontal center
      marginBottom: 14,
    },

    goalBoxActive: {
      backgroundColor: COLORS.primary,
    },

    goalText: {
      fontSize: 16,
      fontWeight: "600",
     color: COLORS.white,
      textAlign: "center",
    },
    
    goalTextActive: {
      color: COLORS.white,
    },
    
    
    
});
