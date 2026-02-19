import {
  Platform,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useRef, useEffect } from "react";

export interface HapticWrapperProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  holdDurationSeconds?: number;
  onHold?: (touchLocation?: { x: number; y: number }) => void;
}

export const HapticWrapper = ({
  children,
  onPress,
  style,
  holdDurationSeconds,
  onHold,
}: HapticWrapperProps) => {
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<View>(null);
  const touchLocationRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  const handlePress = async () => {
    if (Platform.OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Toggle_On
      );
    }

    onPress();
  };

  const handlePressIn = async (event: any) => {
    if (Platform.OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Toggle_On
      );
    }

    // Capture touch location
    if (containerRef.current && event?.nativeEvent) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        // Calculate center of the component
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        touchLocationRef.current = {
          x: centerX,
          y: centerY,
        };
      });
    }

    if (holdDurationSeconds && onHold) {
      const holdDurationMs = holdDurationSeconds * 1000;
      holdTimerRef.current = setTimeout(() => {
        onHold(touchLocationRef.current || undefined);
        holdTimerRef.current = null;
        touchLocationRef.current = null;
      }, holdDurationMs);
    }
  };

  const handlePressOut = async () => {
    if (Platform.OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Toggle_Off
      );
    }

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  return (
    <View ref={containerRef} collapsable={false}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
};
