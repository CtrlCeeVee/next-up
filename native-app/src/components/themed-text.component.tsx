import React from "react";
import { Text, StyleProp, TextStyle as RNTextStyle } from "react-native";
import { useTheme } from "../core/theme";
import { GlobalTextStyles, TextStyle } from "../core/styles/text";

interface ThemedTextProps {
  textStyle: TextStyle;
  children: React.ReactNode;
  style?: StyleProp<RNTextStyle>;
  color?: string;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  textStyle,
  children,
  style,
  color,
}) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        GlobalTextStyles[textStyle],
        { color: color || theme.colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
