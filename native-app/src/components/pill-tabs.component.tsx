import {
  StyleSheet,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
  Animated,
} from "react-native";
import {
  GlobalStyles,
  paddingLarge,
  paddingSmall,
  rounding,
  gap,
  paddingXSmall,
} from "../core/styles/global";
import { GlobalTextStyles, TextStyle } from "../core/styles/text";
import { ThemedText } from "./themed-text.component";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "../core/theme";

interface PillTabsProps<T extends string> {
  options: T[];
  onOptionChange: (option: T) => void;
  initialOption?: T;
}

export const PillTabs = <T extends string = string>({
  options,
  onOptionChange,
  initialOption,
}: PillTabsProps<T>) => {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<T>(
    initialOption ?? options[0]
  );
  const containerRef = useRef<View>(null);
  const optionLayouts = useRef<
    Record<string, { width: number; x: number; y: number }>
  >({});

  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;

  const animateToPosition = (width: number, x: number, y: number) => {
    Animated.parallel([
      Animated.spring(animatedWidth, {
        toValue: width,
        useNativeDriver: false,
        damping: 20,
        stiffness: 300,
      }),
      Animated.spring(animatedX, {
        toValue: x,
        useNativeDriver: false,
        damping: 20,
        stiffness: 300,
      }),
      Animated.spring(animatedY, {
        toValue: y,
        useNativeDriver: false,
        damping: 20,
        stiffness: 300,
      }),
    ]).start();
  };

  const handleOptionLayout = (option: string, event: LayoutChangeEvent) => {
    const { width, x, y } = event.nativeEvent.layout;
    optionLayouts.current[option] = { width, x, y };

    if (option === selectedOption) {
      // Set initial position without animation
      animatedWidth.setValue(width);
      animatedX.setValue(x);
      animatedY.setValue(y);
    }
  };

  useEffect(() => {
    const layout = optionLayouts.current[selectedOption];
    if (layout) {
      animateToPosition(layout.width, layout.x, layout.y);
    }
  }, [selectedOption]);

  const handleOptionPress = (option: T) => {
    setSelectedOption(option);
    onOptionChange(option);
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer} ref={containerRef}>
        <Animated.View
          style={[
            styles.optionSelectedIndicator,
            {
              backgroundColor: theme.colors.primary,
              opacity: 0.8,
            },
            {
              width: animatedWidth,
              transform: [{ translateX: animatedX }, { translateY: animatedY }],
            },
          ]}
        />
        {options.map((option) => (
          <TouchableOpacity
            onPress={() => handleOptionPress(option)}
            onLayout={(event) => handleOptionLayout(option, event)}
            style={styles.option}
            key={option}
          >
            <ThemedText textStyle={TextStyle.BodyMedium} style={[styles.text]}>
              {option}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  optionsContainer: {
    ...GlobalStyles.row,
    gap: gap.sm,
    padding: paddingXSmall,
    borderRadius: rounding,
    backgroundColor: "#b8b8b840",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    flexWrap: "wrap",
  },
  optionSelectedIndicator: {
    position: "absolute",
    height: "100%",
    borderRadius: rounding,
    top: 0,
    left: 0,
  },
  option: {
    paddingVertical: paddingSmall,
    paddingHorizontal: paddingSmall,
    borderRadius: rounding,
  },
  optionSelected: {
    backgroundColor: "white",
  },
  text: {
    ...GlobalTextStyles[TextStyle.BodyMedium],
  },
  textSelected: {
    color: "black",
  },
});
