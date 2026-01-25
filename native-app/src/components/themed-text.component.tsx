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
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  textStyle,
  children,
  style,
  color,
  muted,
}) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        GlobalTextStyles[textStyle],
        {
          color: color || (muted ? theme.colors.muted : theme.colors.text),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
