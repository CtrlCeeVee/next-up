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
  w100?: boolean;
  grow?: boolean;
  wrap?: boolean;
  startVertical?: boolean;
  centerVertical?: boolean;
  endVertical?: boolean;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  textStyle,
  children,
  style,
  color,
  muted,
  center,
  w100,
  grow = false,
  wrap,
  startVertical = false,
  centerVertical = false,
  endVertical = false,
}) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        GlobalTextStyles[textStyle],
        {
          color: color || (muted ? theme.colors.muted : theme.colors.text),
          textAlign: center ? "center" : "left",
          ...(grow ? { flex: 1, flexShrink: 1, minWidth: 0 } : {}),
          ...(w100 ? { width: "100%" } : {}),
          ...(wrap ? { flexWrap: "wrap" } : {}),
          ...(startVertical ? { textAlignVertical: "top" } : {}),
          ...(centerVertical ? { textAlignVertical: "center" } : {}),
          ...(endVertical ? { textAlignVertical: "bottom" } : {}),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
