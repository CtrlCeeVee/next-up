import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  DimensionValue,
} from "react-native";
import { useTheme } from "../../core/theme";
import { Container } from "../container.component";
import { ThemedText } from "../themed-text.component";
import { Button } from "../button.component";
import { Icon } from "../../icons";
import {
  padding,
  paddingSmall,
  rounding,
  roundingSmall,
  gap,
  shadow,
} from "../../core/styles/global";
import { TextStyle } from "../../core/styles/text";
import { ModalConfig, ModalSize, ModalType } from "./modal-types";

interface ModalComponentProps {
  config: ModalConfig | null;
  isVisible: boolean;
  onClose: () => void;
}

export const ModalComponent: React.FC<ModalComponentProps> = ({
  config,
  isVisible,
  onClose,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isVisible) {
      // Start animations immediately and ensure modal is interactive
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, scaleAnim]);

  if (!config) {
    return null;
  }

  const handleBackdropPress = () => {
    if (config.dismissible !== false) {
      onClose();
    }
  };

  const getModalSize = (): {
    width: DimensionValue;
    maxHeight?: DimensionValue;
  } => {
    switch (config.size) {
      case ModalSize.Small:
        return { width: "80%", maxHeight: "40%" };
      case ModalSize.Large:
        return { width: "90%", maxHeight: "80%" };
      case ModalSize.FullScreen:
        return { width: "100%", maxHeight: "100%" };
      case ModalSize.Medium:
      default:
        return { width: "85%", maxHeight: "70%" };
    }
  };

  const renderContent = () => {
    if (config.type === ModalType.Custom && config.content) {
      return config.content;
    }

    return (
      <Container column w100 gap={gap.md} padding={padding}>
        {config.title && (
          <ThemedText textStyle={TextStyle.Header} style={styles.title}>
            {config.title}
          </ThemedText>
        )}

        {config.message && (
          <ThemedText
            textStyle={TextStyle.Body}
            style={[styles.message, { color: theme.colors.text + "CC" }]}
          >
            {config.message}
          </ThemedText>
        )}

        {config.type === ModalType.Alert && (
          <Container row w100 gap={gap.md} style={styles.buttonContainer}>
            <Button
              text={config.confirmText || "OK"}
              onPress={() => {
                if (config.onConfirm) {
                  config.onConfirm();
                } else {
                  onClose();
                }
              }}
              variant="primary"
              style={styles.button}
            />
          </Container>
        )}

        {config.type === ModalType.Confirm && (
          <Container row w100 gap={gap.md} style={styles.buttonContainer}>
            <Button
              text={config.cancelText || "Cancel"}
              onPress={() => {
                if (config.onCancel) {
                  config.onCancel();
                } else {
                  onClose();
                }
              }}
              variant="secondary"
              style={styles.button}
            />
            <Button
              text={config.confirmText || "Confirm"}
              onPress={() => {
                if (config.onConfirm) {
                  config.onConfirm();
                } else {
                  onClose();
                }
              }}
              variant="primary"
              style={styles.button}
            />
          </Container>
        )}
      </Container>
    );
  };

  const modalSize = getModalSize();
  const backgroundColor = config.backgroundColor || theme.colors.background;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType={config.animationType || "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable
          style={styles.backdrop}
          onPress={handleBackdropPress}
          accessible={false}
          pointerEvents={isVisible ? "auto" : "none"}
        >
          <Animated.View
            style={[
              styles.backdropAnimated,
              {
                opacity: fadeAnim,
              },
            ]}
            pointerEvents="none"
          />
        </Pressable>

        <View style={styles.modalContainer} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor,
                width: modalSize.width,
                maxHeight: modalSize.maxHeight,
                transform: [{ scale: scaleAnim }],
              },
              shadow.medium,
            ]}
            accessible
            accessibilityRole="alert"
            accessibilityLabel={config.title || "Modal"}
            pointerEvents="auto"
          >
            {config.showCloseButton !== false &&
              config.type === ModalType.Custom && (
                <Container
                  row
                  w100
                  style={styles.closeButtonContainer}
                  endHorizontal
                >
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    accessible
                    accessibilityLabel="Close modal"
                    accessibilityRole="button"
                  >
                    <Icon name="x" size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                </Container>
              )}

            {config.type === ModalType.Custom && config.content ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {renderContent()}
              </ScrollView>
            ) : (
              <View style={styles.contentContainer}>{renderContent()}</View>
            )}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropAnimated: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: rounding,
    overflow: "hidden",
  },
  title: {
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: gap.sm,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  closeButtonContainer: {
    padding: padding,
    paddingBottom: 0,
  },
  closeButton: {
    padding: paddingSmall,
    borderRadius: roundingSmall,
  },
  contentContainer: {
    flex: 1,
  },
});
