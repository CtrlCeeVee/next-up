import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "../../../components";
import { Icon, IconName } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { TextStyle, spacing, gap } from "../../../core/styles";

export type FilterType = "all" | "tonight" | "mine";

interface FilterOption {
  value: FilterType;
  label: string;
  icon: IconName;
}

interface LeagueFiltersProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    value: "all",
    label: "All Leagues",
    icon: "trophy",
  },
  {
    value: "tonight",
    label: "Tonight",
    icon: "zap",
  },
  {
    value: "mine",
    label: "My Leagues",
    icon: "user",
  },
];

export const LeagueFilters: React.FC<LeagueFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={{ gap: gap.sm }}
    >
      {FILTER_OPTIONS.map((filter) => (
        <TouchableOpacity
          key={filter.value}
          onPress={() => onFilterChange(filter.value)}
          style={[
            styles.filterPill,
            {
              backgroundColor:
                selectedFilter === filter.value
                  ? theme.colors.primary
                  : theme.componentBackground,
              borderColor:
                selectedFilter === filter.value
                  ? theme.colors.primary
                  : theme.colors.border,
            },
          ]}
        >
          <Icon
            name={filter.icon}
            size={16}
            color={
              selectedFilter === filter.value ? "#FFFFFF" : theme.colors.text
            }
          />
          <ThemedText
            textStyle={TextStyle.BodySmall}
            style={[
              styles.filterText,
              {
                color:
                  selectedFilter === filter.value
                    ? "#FFFFFF"
                    : theme.colors.text,
              },
            ]}
          >
            {filter.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: spacing.lg,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    gap: gap.sm - 2,
  },
  filterText: {
    fontWeight: "600",
  },
});
