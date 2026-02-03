import React, { useEffect, useRef } from "react";
import { View, StyleSheet, useWindowDimensions, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../core/theme";
import NextUpAnimation from "../../../assets/NextUp";

export const SplashScreen = () => {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const animationWidth = width * 0.8;
  // const dotLeftPosition = (width - animationWidth) / 2;
  const dotMarginRight = animationWidth / 2;

  const dotScale = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={{ width: animationWidth, zIndex: 2 }}>
        {/* <NextUpAnimation /> */}
      </View>

      <Animated.View
        style={[
          styles.dotContainer,
          {
            marginRight: dotMarginRight,
            opacity: dotOpacity,
            transform: [{ scale: dotScale }],
            zIndex: 1,
          },
        ]}
      >
        <LinearGradient
          colors={["#1088fa", "#0ab9a3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.dot}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dotContainer: {
    position: "absolute",
    width: 1,
    height: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 1,
    height: 1,
    borderRadius: 0.5,
  },
});
