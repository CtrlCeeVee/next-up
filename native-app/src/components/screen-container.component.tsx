import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  ScrollView,
  ColorValue,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTheme } from "../core";

export enum LinearGradientDirection {
  UP,
  DOWN,
  RIGHT,
  LEFT,
}

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  edges?: ("top" | "right" | "bottom" | "left")[];
  safeAreaColour?: string;
  linearGradientColour?: [ColorValue, ColorValue, ...ColorValue[]];
  linearGradientDirection?: LinearGradientDirection;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  scrollable = false,
  edges = [],
  safeAreaColour = "transparent",
  linearGradientColour,
  linearGradientDirection = LinearGradientDirection.UP,
}) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const content = (
    <View style={[styles.container, { paddingTop: insets.top }, style]}>
      {children}
    </View>
  );

  const getLinearGradientDirection = () => {
    switch (linearGradientDirection) {
      case LinearGradientDirection.UP:
        return { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } };
      case LinearGradientDirection.DOWN:
        return { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } };
      case LinearGradientDirection.RIGHT:
        return { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } };
      case LinearGradientDirection.LEFT:
        return { start: { x: 0, y: 1 }, end: { x: 1, y: 0 } };
    }
  };

  return (
    <>
      <LinearGradient
        colors={
          linearGradientColour ? linearGradientColour : theme.backgroundGradient
        }
        start={getLinearGradientDirection().start}
        end={getLinearGradientDirection().end}
        style={styles.gradient}
      />
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: safeAreaColour }]}
        edges={edges}
      >
        {scrollable ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
