import { Theme } from "@react-navigation/native";

type FontWeight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export interface ThemeCoreColours extends Theme {
  backgroundGradient: [string, string, string];
  componentBackground: string;
  navigationBarBackground: string;
  stackScreenBackground: string;
  fonts: {
    regular: {
      fontFamily: string;
      fontWeight: FontWeight;
    };
    medium: {
      fontFamily: string;
      fontWeight: FontWeight;
    };
    bold: {
      fontFamily: string;
      fontWeight: FontWeight;
    };
    heavy: {
      fontFamily: string;
      fontWeight: FontWeight;
    };
  };
}

// Shared colors across themes
export const SharedTheme = {
  primary: "#22c55e", // primary-500 from Tailwind
  primaryLight: "#4ade80", // primary-400
  primaryDark: "#16a34a", // primary-600
  accent: "#8b5cf6", // accent-500
  accentLight: "#a855f7", // accent-400
  accentDark: "#33236A", // accent-600
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f97316",
  info: "#3b82f6",
  danger: "#ef4444",
};

export interface AppThemeCoreColours extends ThemeCoreColours {
  colors: {
    danger: string;
    primaryLight: string;
    primaryDark: string;
    sheetBackground: string;
    success: string;
    muted: string;
    error: string;
    warning: string;
    info: string;
    accent: string;
    accentDark: string;
    inputBackground: string;
    cardGradient: [string, string];
    refreshControlBackground: string;
  } & ThemeCoreColours["colors"];
}

// Default fonts (will be replaced with Inter font)
const defaultFonts: AppThemeCoreColours["fonts"] = {
  regular: {
    fontFamily: "Inter-Regular",
    fontWeight: "400",
  },
  medium: {
    fontFamily: "Inter-Medium",
    fontWeight: "500",
  },
  bold: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
  },
  heavy: {
    fontFamily: "Inter-Bold",
    fontWeight: "700",
  },
};

export const DarkTheme: AppThemeCoreColours = {
  backgroundGradient: ["#0f172a", "#1e293b", "#064e3b"], // slate-900 → slate-800 → emerald-900
  componentBackground: "#27272a", // secondary-800
  navigationBarBackground: "#0f172a", // secondary-800
  stackScreenBackground: "#0a101f",
  colors: {
    background: "#283142", // secondary-950
    border: "#29364d",
    card: "#27272a", // secondary-800
    cardGradient: ["rgba(39, 42, 58, 0.8)", "rgba(30, 41, 59, 0.8)"], // secondary-800
    // sheetBackground: "#13263A",
    // sheetBackground: "#162B42",
    sheetBackground: "#1b314B",
    text: "#F0F0F0", // Light gray
    notification: "#F0F0F0",
    primary: SharedTheme.primary,
    primaryLight: SharedTheme.primaryLight,
    primaryDark: SharedTheme.primaryDark,
    success: SharedTheme.success,
    danger: SharedTheme.danger,
    muted: "#64748b", // slate-500
    error: SharedTheme.error,
    warning: SharedTheme.warning,
    info: SharedTheme.info,
    accent: SharedTheme.accent,
    accentDark: SharedTheme.accentDark,
    inputBackground: "rgba(30, 41, 59, 0.8)", // secondary-800
    refreshControlBackground: "#27272a", // secondary-800
  },
  fonts: defaultFonts,
  dark: true,
};

export const LightTheme: AppThemeCoreColours = {
  backgroundGradient: ["#d1fae5", "#f0fdf4", "#f8fafc"], // slate-50 → green-50 → emerald-50
  componentBackground: "#ffffff",
  navigationBarBackground: "#ffffff", // white
  stackScreenBackground: "#f0f0f0", // slightly-darker white
  colors: {
    background: "#f0f0f0",
    border: "#f0f0f0",
    card: "#FFFFFF", //slightly-darker white
    cardGradient: ["rgba(255, 255, 255, 0.9)", "rgba(248, 250, 252, 0.85)"], // slightly-darker white
    text: "#18181b", // secondary-900
    notification: "#18181b",
    primary: SharedTheme.primary,
    primaryLight: SharedTheme.primaryLight,
    sheetBackground: "#ffffff",
    primaryDark: SharedTheme.primaryDark,
    success: SharedTheme.success,
    danger: SharedTheme.danger,
    muted: "#64748b", // slate-500
    error: SharedTheme.error,
    warning: SharedTheme.warning,
    info: SharedTheme.info,
    accent: SharedTheme.accent,
    accentDark: SharedTheme.accentDark,
    inputBackground: "#f0f0f0", // slightly-darker white
    refreshControlBackground: "#f0f0f0", // slightly-darker white
  },
  fonts: defaultFonts,
  dark: false,
};
