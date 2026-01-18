import { StyleSheet } from "react-native";

// Global spacing constants (from Tailwind config)
export const padding = 12;
export const paddingSmall = 8;
export const paddingLarge = 16;
export const paddingXLarge = 24;

// Border radius constants
export const rounding = 8; // rounded-lg
export const roundingSmall = 4; // rounded
export const roundingLarge = 12; // rounded-xl
export const roundingFull = 9999; // rounded-full

// Shadow definitions (approximating Tailwind shadows)
export const shadow = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 3,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },
  hard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 8,
  },
};

// Global layout styles
export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fullWidth: {
    width: "100%",
  },
});
