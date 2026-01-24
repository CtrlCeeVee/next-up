import { StyleSheet } from "react-native";

// Global spacing constants (from Tailwind config)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// Legacy spacing exports (for backward compatibility)
export const padding = spacing.md; // 12
export const paddingSmall = spacing.sm; // 8
export const paddingLarge = spacing.lg; // 16
export const paddingXLarge = spacing.xl; // 24

// Gap constants
export const gap = {
  xs: spacing.xs, // 4
  sm: spacing.sm, // 8
  md: spacing.md, // 12
  lg: spacing.lg, // 16
  xl: spacing.xl, // 24
};

// Border radius constants
export const rounding = 21; // rounded-lg
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
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
