import React from "react";

export enum ModalType {
  Alert = "alert",
  Confirm = "confirm",
  Custom = "custom",
}

export enum ModalSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
  FullScreen = "fullscreen",
}

export interface ModalConfig {
  type: ModalType;
  title?: string;
  message?: string;
  content?: React.ReactNode;
  size?: ModalSize;
  dismissible?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  backgroundColor?: string;
  animationType?: "none" | "slide" | "fade";
}
