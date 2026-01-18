import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle as RNTextStyle,
  View,
} from "react-native";
import { useTheme } from "../core/theme";
import { rounding, padding } from "../core/styles/global";
import { GlobalTextStyles, TextStyle } from "../core/styles/text";
import { Icon, IconName } from "../icons";

interface ButtonProps {
  onPress: () => void;
  title?: string; // Keep for backward compatibility
  text?: string; // New prop name
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: IconName;
  style?: ViewStyle;
  textStyle?: RNTextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  text,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  leftIcon,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const buttonText = text || title || ""; // Support both props

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: rounding,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    };

    // Size
    const sizeStyle: ViewStyle = {
      small: { paddingVertical: padding / 2, paddingHorizontal: padding },
      medium: { paddingVertical: padding, paddingHorizontal: padding * 1.5 },
      large: { paddingVertical: padding * 1.5, paddingHorizontal: padding * 2 },
    }[size];

    // Variant
    const variantStyle: ViewStyle = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.componentBackground,
        borderWidth: 1,
        borderColor: theme.colors.primary + "40",
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: "transparent",
      },
      link: {
        backgroundColor: "transparent",
        paddingVertical: 0,
        paddingHorizontal: 0,
      },
    }[variant];

    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      opacity: disabled || loading ? 0.5 : 1,
    };
  };

  const getTextStyle = (): RNTextStyle => {
    const baseStyle = variant === "link"
      ? GlobalTextStyles[TextStyle.Body]
      : GlobalTextStyles[TextStyle.Button];

    const variantTextColor = {
      primary: "#FFFFFF",
      secondary: theme.colors.primary,
      outline: theme.colors.primary,
      ghost: theme.colors.primary,
      link: theme.colors.primary,
    }[variant];

    return {
      ...baseStyle,
      color: variantTextColor,
      ...(variant === "link" && { textDecorationLine: "underline" as const }),
    };
  };

  const iconColor = variant === "primary" ? "#FFFFFF" : theme.colors.primary;

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : theme.colors.primary} />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <Icon
              name={leftIcon}
              size={18}
              color={iconColor}
              style={styles.leftIcon}
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>{buttonText}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftIcon: {
    marginRight: 8,
  },
});
