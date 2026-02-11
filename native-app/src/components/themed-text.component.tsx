import React from "react";
import { Text, StyleProp, TextStyle as RNTextStyle } from "react-native";
import { useTheme } from "../core/theme";
import { GlobalTextStyles, TextStyle } from "../core/styles/text";

interface ThemedTextProps {
  textStyle: TextStyle;
  children: React.ReactNode;
  style?: StyleProp<RNTextStyle>;
  color?: string;
  muted?: boolean;
  center?: boolean;
  growHorizontal?: boolean;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  textStyle,
  children,
  style,
  color,
  muted,
  center,
  growHorizontal,
}) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        GlobalTextStyles[textStyle],
        {
          color: color || (muted ? theme.colors.muted : theme.colors.text),
          textAlign: center ? "center" : "left",
          ...(growHorizontal ? { width: "100%" } : {}),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
