import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../../core/theme";
import { PopoverConfig } from "./popover-context";
import { roundingLarge } from "../../core/styles";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PopoverComponentProps {
  isVisible: boolean;
  config: PopoverConfig | null;
  onDismiss: () => void;
}

export const PopoverComponent: React.FC<PopoverComponentProps> = ({
  isVisible,
  config,
  onDismiss,
}) => {
  const { theme, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const [containerLayout, setContainerLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (isVisible && config) {
      const initialPosition = config.initialPosition;
      
      if (initialPosition && containerLayout) {
        // Calculate center position
        const centerX = SCREEN_WIDTH / 2;
        const centerY = SCREEN_HEIGHT / 2;
        
        // Calculate offsets from touch position to center
        const offsetX = centerX - initialPosition.x;
        const offsetY = centerY - initialPosition.y;
        
        // Set initial values
        translateXAnim.setValue(-offsetX);
        translateYAnim.setValue(-offsetY);
        scaleAnim.setValue(0);
        
        // Animate to center
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(translateXAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(translateYAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Fallback: animate from center with scale
        scaleAnim.setValue(0);
        translateXAnim.setValue(0);
        translateYAnim.setValue(0);
        
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, config, containerLayout, fadeAnim, scaleAnim, translateXAnim, translateYAnim]);

  if (!config) return null;

  const glassBackgroundColor = isDark
    ? "rgba(15, 23, 42, 0.7)"
    : "rgba(255, 255, 255, 0.25)";
  const glassBorderColor = isDark
    ? "rgba(148, 163, 184, 0.2)"
    : "rgba(255, 255, 255, 0.18)";

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Pressable style={styles.backdrop} onPress={onDismiss}>
          <BlurView
            intensity={20}
            tint={isDark ? "dark" : "light"}
            style={styles.blurView}
          >
            <Animated.View
              style={[
                styles.blurOverlay,
                {
                  opacity: fadeAnim,
                },
              ]}
            />
          </BlurView>
        </Pressable>

        <Pressable
          style={styles.contentWrapper}
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <Animated.View
            style={[
              styles.glassContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateX: translateXAnim },
                  { translateY: translateYAnim },
                ],
                backgroundColor: glassBackgroundColor,
                borderColor: glassBorderColor,
              },
            ]}
            pointerEvents="box-only"
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              if (!containerLayout) {
                setContainerLayout({ width, height });
              }
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {config.content}
            </ScrollView>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    flex: 1,
  },
  blurOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  contentWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    pointerEvents: "box-none",
  },
  glassContainer: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    borderRadius: roundingLarge,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  scrollContent: {
    padding: 20,
  },
});
