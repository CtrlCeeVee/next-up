import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, StyleSheet, ViewStyle, ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTheme } from "../core";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  edges?: ("top" | "right" | "bottom" | "left")[];
  safeAreaColour?: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  scrollable = false,
  edges = [],
  safeAreaColour = "transparent",
}) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const content = (
    <View style={[styles.container, { paddingTop: insets.top }, style]}>
      {children}
    </View>
  );

  return (
    <>
      <LinearGradient
        colors={theme.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
