import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { TextStyle, spacing, gap } from "../../../core/styles";

export const EmptyLeagues: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <Icon name="search" size={48} color={theme.colors.text + "40"} />
      <ThemedText textStyle={TextStyle.Body} style={styles.emptyText}>
        No leagues found
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxxl + 8,
    gap: gap.lg,
  },
  emptyText: {
    opacity: 0.5,
  },
});
