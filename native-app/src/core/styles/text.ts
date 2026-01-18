import { StyleSheet, Platform } from "react-native";
import { PrimaryFont } from "../font";

export enum TextStyle {
  Header = "header",
  Subheader = "subheader",
  Body = "body",
  BodyMedium = "bodyMedium",
  BodySmall = "bodySmall",
  Caption = "caption",
  Button = "button",
}

// Fallback to system fonts if custom fonts aren't loaded
const getFontFamily = (customFont: string, fallback: string) => {
  // System defaults
  const systemFont = Platform.select({
    ios: fallback,
    android: "Roboto",
    default: "System",
  });
  
  // Try custom font, fallback to system font
  return customFont || systemFont;
};

export const GlobalTextStyles = StyleSheet.create({
  [TextStyle.Header]: {
    fontFamily: getFontFamily(PrimaryFont.Bold, "System"),
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
  },
  [TextStyle.Subheader]: {
    fontFamily: getFontFamily(PrimaryFont.SemiBold, "System"),
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "600",
  },
  [TextStyle.Body]: {
    fontFamily: getFontFamily(PrimaryFont.Regular, "System"),
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  [TextStyle.BodyMedium]: {
    fontFamily: getFontFamily(PrimaryFont.Regular, "System"),
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  [TextStyle.BodySmall]: {
    fontFamily: getFontFamily(PrimaryFont.Light, "System"),
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "300",
  },
  [TextStyle.Caption]: {
    fontFamily: getFontFamily(PrimaryFont.Light, "System"),
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "300",
  },
  [TextStyle.Button]: {
    fontFamily: getFontFamily(PrimaryFont.Medium, "System"),
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "500",
  },
});
