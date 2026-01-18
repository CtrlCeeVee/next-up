import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { IconProps } from "./icon.types";
import { IconMap } from "./icon.map";
import { useTheme } from "../core/theme";

/**
 * Icon component - Factory pattern for consistent icon usage
 * 
 * Features:
 * - Semantic naming (e.g., "arrow-left" instead of "arrow-back")
 * - Theme-aware (uses theme color by default)
 * - Easily swappable icon library
 * - Type-safe icon names
 * 
 * Usage:
 * ```tsx
 * <Icon name="trophy" size={24} />
 * <Icon name="user" color={theme.colors.primary} />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  style,
}) => {
  const { theme } = useTheme();
  const iconName = IconMap[name];
  const iconColor = color || theme.colors.text;

  // Type assertion needed because Ionicons expects its own icon name type
  return (
    <Ionicons
      name={iconName as any}
      size={size}
      color={iconColor}
      style={style}
    />
  );
};
