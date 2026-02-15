import React, { createContext, useContext, useState, useCallback } from "react";
import { ModalConfig, ModalType } from "./modal-types";
import { Container } from "../container.component";
import { ThemedText } from "../themed-text.component";
import {
  gap,
  padding,
  paddingLarge,
  rounding,
  spacing,
  TextStyle,
} from "../../core/styles";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../../core/theme";

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  showAlert: (
    title: string,
    message?: string,
    onPress?: () => void,
    buttonText?: string,
    buttonColors?: {
      background: string;
      text: string;
    }
  ) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
    buttonColors?: {
      confirmBackground: string;
      confirmText: string;
      cancelBackground: string;
      cancelText: string;
    }
  ) => void;
  showCustom: (content: React.ReactNode, config?: Partial<ModalConfig>) => void;
  hideModal: () => void;
  isVisible: boolean;
  currentModal: ModalConfig | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<ModalConfig | null>(null);

  const showModal = useCallback((config: ModalConfig) => {
    setCurrentModal(config);
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
    if (currentModal?.onClose) {
      currentModal.onClose();
    }
    setTimeout(() => {
      setCurrentModal(null);
    }, 300);
  }, [currentModal]);

  const showCustom = useCallback(
    (content: React.ReactNode, config?: Partial<ModalConfig>) => {
      showModal({
        type: ModalType.Custom,
        content,
        ...config,
      });
    },
    [showModal]
  );

  const showAlert = useCallback(
    (
      title: string,
      message?: string,
      onPress?: () => void,
      buttonText: string = "OK",
      buttonColors?: {
        background: string;
        text: string;
      }
    ) => {
      const handlePress = () => {
        hideModal();
        if (onPress) {
          onPress();
        }
      };

      showCustom(
        <Container
          column
          gap={gap.md}
          padding={padding}
          centerHorizontal
          w100
          h100
        >
          <ThemedText textStyle={TextStyle.Header} center>
            {title}
          </ThemedText>
          {message && (
            <ThemedText textStyle={TextStyle.Body} center>
              {message}
            </ThemedText>
          )}
          <Container
            centerHorizontal
            style={{ width: "100%", maxWidth: 300, marginTop: spacing.lg }}
          >
            <TouchableOpacity
              onPress={handlePress}
              style={{
                backgroundColor:
                  buttonColors?.background || theme.colors.primary,
                padding: paddingLarge,
                borderRadius: rounding,
                width: "100%",
              }}
            >
              <ThemedText
                textStyle={TextStyle.BodySmall}
                color={buttonColors?.text || "white"}
                center
              >
                {buttonText}
              </ThemedText>
            </TouchableOpacity>
          </Container>
        </Container>
      );
    },
    [showCustom, hideModal, theme]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void,
      confirmText: string = "Confirm",
      cancelText: string = "Cancel",
      buttonColors?: {
        confirmBackground: string;
        confirmText: string;
        cancelBackground: string;
        cancelText: string;
      }
    ) => {
      const handleConfirm = () => {
        hideModal();
        onConfirm();
      };

      const handleCancel = () => {
        hideModal();
        if (onCancel) {
          onCancel();
        }
      };

      showCustom(
        <Container
          column
          gap={gap.md}
          padding={padding}
          centerHorizontal
          w100
          h100
        >
          <ThemedText textStyle={TextStyle.Header} center>
            {title}
          </ThemedText>
          <ThemedText textStyle={TextStyle.Body} center>
            {message}
          </ThemedText>
          <Container
            column
            gap={gap.md}
            centerHorizontal
            style={{ width: "100%", maxWidth: 300, marginTop: spacing.lg }}
          >
            <TouchableOpacity
              onPress={handleConfirm}
              style={{
                backgroundColor:
                  buttonColors?.confirmBackground || theme.colors.primary,
                padding: paddingLarge,
                borderRadius: rounding,
                width: "100%",
              }}
            >
              <ThemedText
                textStyle={TextStyle.BodySmall}
                color={buttonColors?.confirmText || "white"}
                center
              >
                {confirmText}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              style={{
                backgroundColor:
                  buttonColors?.cancelBackground || theme.colors.secondary,
                padding: paddingLarge,
                borderRadius: rounding,
                width: "100%",
              }}
            >
              <ThemedText
                textStyle={TextStyle.BodySmall}
                color={buttonColors?.cancelText || "white"}
                center
              >
                {cancelText}
              </ThemedText>
            </TouchableOpacity>
          </Container>
        </Container>
      );
    },
    [showCustom, hideModal, theme]
  );

  const value: ModalContextType = {
    showModal,
    showAlert,
    showConfirm,
    showCustom,
    hideModal,
    isVisible,
    currentModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
