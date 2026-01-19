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
  accent: "#f97316", // accent-500
  accentLight: "#fb923c", // accent-400
  accentDark: "#ea580c", // accent-600
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f97316",
  info: "#3b82f6",
};

export interface AppThemeCoreColours extends ThemeCoreColours {
  colors: {
    success: string;
    error: string;
    warning: string;
    info: string;
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
  colors: {
    background: "#283142", // secondary-950
    border: "#29364d",
    card: "#27272a", // secondary-800
    text: "#F0F0F0", // Light gray
    notification: "#F0F0F0",
    primary: SharedTheme.primary,
    success: SharedTheme.success,
    error: SharedTheme.error,
    warning: SharedTheme.warning,
    info: SharedTheme.info,
  },
  fonts: defaultFonts,
  dark: true,
};

export const LightTheme: AppThemeCoreColours = {
  backgroundGradient: ["#d1fae5", "#f0fdf4", "#f8fafc"], // slate-50 → green-50 → emerald-50
  componentBackground: "#ffffff",
  colors: {
    background: "#f0f0f0",
    border: "#f0f0f0",
    card: "#FFFFFF", //slightly-darker white
    text: "#18181b", // secondary-900
    notification: "#18181b",
    primary: SharedTheme.primary,
    success: SharedTheme.success,
    error: SharedTheme.error,
    warning: SharedTheme.warning,
    info: SharedTheme.info,
  },
  fonts: defaultFonts,
  dark: false,
};
