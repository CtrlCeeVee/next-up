import React, { useEffect } from "react";
import { ViewStyle, StyleSheet, View, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../core/theme";
import { Card } from "./card.component";

interface ShimmerComponentProps {
  width?: number | string;
  height?: number | string;
  rounding?: number;
  style?: ViewStyle;
  renderCardUnderneath?: boolean;
  /**
   * Base color for the shimmer effect (defaults to gray)
   */
  baseColor?: string;
  /**
   * Highlight color for the shimmer effect (defaults to lighter gray)
   */
  highlightColor?: string;
  /**
   * Animation duration in milliseconds (default: 1500)
   */
  duration?: number;
  /**
   * Direction of the shimmer animation: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top'
   * (default: 'left-to-right')
   */
  direction?:
    | "left-to-right"
    | "right-to-left"
    | "top-to-bottom"
    | "bottom-to-top";
}

export const ShimmerComponent: React.FC<ShimmerComponentProps> = ({
  width = "100%",
  height = 20,
  rounding = 0,
  style,
  baseColor,
  highlightColor,
  duration = 1200,
  direction = "left-to-right",
  renderCardUnderneath = false,
}) => {
  const { theme } = useTheme();
  const shimmerTranslate = useSharedValue(-1);
  const componentWidth = useSharedValue(0);
  const componentHeight = useSharedValue(0);

  // Default colors based on theme
  const defaultBaseColor = baseColor || "transparent";
  const defaultHighlightColor = highlightColor || theme.colors.muted + "60";

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: measuredWidth, height: measuredHeight } =
      event.nativeEvent.layout;
    componentWidth.value = measuredWidth;
    componentHeight.value = measuredHeight;
  };

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false // Don't reverse
    );
  }, [duration]);

  const getGradientStartEnd = () => {
    switch (direction) {
      case "left-to-right":
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
      case "right-to-left":
        return { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } };
      case "top-to-bottom":
        return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
      case "bottom-to-top":
        return { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } };
      default:
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const isHorizontal =
      direction === "left-to-right" || direction === "right-to-left";

    if (isHorizontal) {
      // Use component width for smooth animation across the entire component
      const widthValue = componentWidth.value;
      const translateX = interpolate(
        shimmerTranslate.value,
        [-1, 1],
        widthValue > 0 ? [-widthValue * 1.5, widthValue * 1.5] : [-300, 300]
      );
      return {
        transform: [{ translateX }],
      };
    } else {
      // Use component height for smooth animation across the entire component
      const heightValue = componentHeight.value;
      const translateY = interpolate(
        shimmerTranslate.value,
        [-1, 1],
        heightValue > 0 ? [-heightValue * 1.5, heightValue * 1.5] : [-300, 300]
      );
      return {
        transform: [{ translateY }],
      };
    }
  });

  const gradientStartEnd = getGradientStartEnd();

  const containerStyle: ViewStyle = {
    width: width as ViewStyle["width"],
    height: height as ViewStyle["height"],
    borderRadius: rounding,
    backgroundColor: defaultBaseColor,
    overflow: "hidden",
  };

  const renderContent = () => {
    return (
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={["transparent", defaultHighlightColor, "transparent"]}
          start={gradientStartEnd.start}
          end={gradientStartEnd.end}
          style={styles.gradient}
        />
      </Animated.View>
    );
  };

  return (
    <View
      style={[styles.container, containerStyle, style]}
      onLayout={handleLayout}
    >
      {renderCardUnderneath ? (
        <Card style={{ width: "100%", height: "100%", padding: 0 }}>
          {renderContent()}
        </Card>
      ) : (
        renderContent()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
