import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

/**
 * Icon name type - semantic names for icons used in the app
 */
export type IconName =
  // Navigation
  | "arrow-left"
  | "arrow-right"
  | "arrow-up"
  | "arrow-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "chevron-down"
  | "close"
  | "menu"
  | "home"
  | "open-external"
  // Theme
  | "moon"
  | "sun"
  // Sports & Awards
  | "trophy"
  | "star"
  | "star-outline"
  | "medal"
  | "flame"
  // People
  | "user"
  | "users"
  | "user-add"
  | "user-plus"
  | "user-check"
  | "user-x"
  // Location & Time
  | "map-pin"
  | "calendar"
  | "clock"
  // Actions
  | "search"
  | "plus"
  | "minus"
  | "x"
  | "logout"
  | "send"
  | "edit"
  | "delete"
  | "refresh"
  | "share"
  // Notifications
  | "bell"
  | "bell-outline"
  // Stats
  | "bar-chart"
  | "trending-up"
  | "trending-down"
  // Security
  | "shield"
  | "shield-alert"
  | "lock"
  | "lock-open"
  | "eye"
  | "eye-off"
  // Status
  | "alert-circle"
  | "alert-triangle"
  | "check-circle"
  | "info"
  | "plus-circle"
  // Communication
  | "mail"
  | "phone"
  | "message"
  // Content
  | "file"
  | "file-text"
  | "image"
  | "video"
  | "list"
  // Settings
  | "settings"
  | "sliders"
  | "filter"
  // Sports specific
  | "tennis-ball"
  | "play"
  | "pause"
  | "stop-circle"
  | "heart"
  | "heart-outline"
  // Misc
  | "zap"
  | "target"
  | "sparkle"
  | "moon"
  | "checkmark";

/**
 * Icon component props
 */
export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ComponentProps<typeof Ionicons>["style"];
}
