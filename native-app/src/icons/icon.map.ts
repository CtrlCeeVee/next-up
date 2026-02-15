import { IconName } from "./icon.types";

/**
 * Maps semantic icon names to Ionicons names
 * This allows us to easily swap icon libraries or change specific icons
 * without updating all components that use them
 */
export const IconMap: Record<IconName, string> = {
  // Navigation
  "arrow-left": "arrow-back",
  "arrow-right": "arrow-forward",
  "arrow-up": "arrow-up",
  "arrow-down": "arrow-down",
  "chevron-left": "chevron-back",
  "chevron-right": "chevron-forward",
  "chevron-up": "chevron-up",
  "chevron-down": "chevron-down",
  close: "close",
  menu: "menu",
  home: "home",
  "open-external": "open-outline",

  // Theme
  moon: "moon",
  sun: "sunny",

  // Sports & Awards
  trophy: "trophy",
  star: "star",
  "star-outline": "star-outline",
  medal: "medal",
  flame: "flame",

  // People
  user: "person",
  users: "people",
  "user-add": "person-add",
  "user-plus": "person-add",
  "user-check": "person-add",
  "user-x": "person-remove",

  // Location & Time
  "map-pin": "location",
  calendar: "calendar",
  clock: "time",

  // Actions
  search: "search",
  plus: "add",
  minus: "remove",
  x: "close",
  logout: "log-out",
  send: "send",
  edit: "create",
  delete: "trash",
  refresh: "refresh",
  share: "share-social",

  // Notifications
  bell: "notifications",
  "bell-outline": "notifications-outline",

  // Stats
  "bar-chart": "bar-chart",
  "trending-up": "trending-up",
  "trending-down": "trending-down",

  // Security
  shield: "shield",
  "shield-alert": "shield-checkmark",
  lock: "lock-closed",
  "lock-open": "lock-open",
  eye: "eye",
  "eye-off": "eye-off",

  // Status
  "alert-circle": "alert-circle",
  "alert-triangle": "warning",
  "check-circle": "checkmark-circle",
  info: "information-circle",
  "plus-circle": "add-circle",

  // Communication
  mail: "mail",
  phone: "call",
  message: "chatbubble",

  // Content
  file: "document",
  "file-text": "document-text",
  image: "image",
  video: "videocam",
  list: "list",

  // Settings
  settings: "settings",
  sliders: "options",
  filter: "funnel",

  // Sports specific
  "tennis-ball": "tennisball",
  play: "play",
  pause: "pause",
  "stop-circle": "stop-circle",
  heart: "heart",
  "heart-outline": "heart-outline",

  // Misc
  zap: "flash",
  target: "location",
  sparkle: "sparkles",
  checkmark: "checkmark",

  // inbox
  inbox: "mail-unread",
  outbox: "send",
  fire: "flame",
};
