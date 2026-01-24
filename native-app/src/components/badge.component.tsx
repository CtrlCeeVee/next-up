import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "./themed-text.component";
import { Icon, IconName, TextStyle } from "..";
import { useTheme } from "../core/theme";
import { rounding, spacing, gap } from "../core/styles/global";

interface BadgeComponentProps {
  icon: IconName;
  text: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const BadgeComponent = ({ icon, text, color, style }: BadgeComponentProps) => {
  const { theme, isDark } = useTheme();

  const opacify = (color: string) => {
    return isDark ? (color + "20") : (color + "20");
  };

  const getColor = () => {
    if (color) {
      return color;
    }
    return theme.colors.primary;
  };

  return (
    <View style={[styles.badge, { backgroundColor: opacify(getColor()) }, style]}>
      <Icon name={icon} size={12} color={getColor()} />
      <ThemedText
        textStyle={TextStyle.BodySmall}
        style={{ color: getColor() }}
      >
        {text}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm - 2,
    borderRadius: rounding,
    gap: gap.xs,
  },
});
