import { Theme } from "@react-navigation/native";

export interface ThemeCoreColours extends Theme {
  backgroundGradient: [string, string];
  componentBackground: string;
  fonts: {
    regular: {
      fontFamily: string;
      fontWeight: string;
    };
    medium: {
      fontFamily: string;
      fontWeight: string;
    };
    bold: {
      fontFamily: string;
      fontWeight: string;
    };
    heavy: {
      fontFamily: string;
      fontWeight: string;
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
};

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
  backgroundGradient: ["#18181b", "#09090b"], // secondary-900 to 950
  componentBackground: "#27272a", // secondary-800
  colors: {
    background: "#09090b", // secondary-950
    border: "transparent",
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
  backgroundGradient: ["#FFFFFF", "#fafafa"], // white to secondary-50
  componentBackground: "#f5f5f5",
  colors: {
    background: "#FFFFFF",
    border: "transparent",
    card: "#f0f0f0", //slightly-darker white
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
