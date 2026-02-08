import { View, ViewStyle, StyleSheet, LayoutChangeEvent } from "react-native";
import { gap } from "../core";

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  row?: boolean;
  column?: boolean;
  centerVertical?: boolean;
  centerHorizontal?: boolean;
  startVertical?: boolean;
  startHorizontal?: boolean;
  endVertical?: boolean;
  endHorizontal?: boolean;
  spaceBetween?: boolean;
  spaceAround?: boolean;
  gap?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  growVertical?: boolean;
  growHorizontal?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const DEFAULT_GAP = gap.xs;

export const Container = ({
  children,
  style = {},
  row = false,
  column = false,
  centerVertical = false,
  centerHorizontal = false,
  startVertical = false,
  startHorizontal = false,
  endVertical = false,
  endHorizontal = false,
  spaceBetween = false,
  spaceAround = false,
  gap = DEFAULT_GAP,
  padding = 0,
  paddingHorizontal = 0,
  paddingVertical = 0,
  growVertical = false,
  growHorizontal = false,
  onLayout,
}: ContainerProps) => {
  const getFlexDirection = () => {
    if (row) return "row";
    if (column) return "column";
    return "row";
  };

  const getAlignItems = () => {
    if (row && centerVertical) return "center";
    if (column && centerHorizontal) return "center";
    if (row && startVertical) return "flex-start";
    if (column && startHorizontal) return "flex-start";
    if (row && endVertical) return "flex-end";
    if (column && endHorizontal) return "flex-end";
    return "flex-start";
  };

  const getJustifyContent = () => {
    if (row && centerHorizontal) return "center";
    if (column && centerVertical) return "center";
    if (row && startHorizontal) return "flex-start";
    if (column && startVertical) return "flex-start";
    if (row && endHorizontal) return "flex-end";
    if (column && endVertical) return "flex-end";
    if (row && spaceBetween) return "space-between";
    if (column && spaceBetween) return "space-between";
    if (row && spaceAround) return "space-around";
    if (column && spaceAround) return "space-around";
    return "flex-start";
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: getFlexDirection(),
      alignItems: getAlignItems(),
      justifyContent: getJustifyContent(),
      gap: gap,
      ...style,
      ...(growVertical && { flex: 1 }),
      ...(growHorizontal && { width: "100%" }),
      ...(padding && { padding: padding }),
      ...(paddingHorizontal && { paddingHorizontal: paddingHorizontal }),
      ...(paddingVertical && { paddingVertical: paddingVertical }),
    },
  });
  return (
    <View style={styles.container} onLayout={onLayout}>
      {children}
    </View>
  );
};
