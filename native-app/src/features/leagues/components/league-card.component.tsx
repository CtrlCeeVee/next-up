import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText, Card } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import {
  TextStyle,
  spacing,
  gap,
  roundingFull,
  roundingSmall,
  paddingSmall,
  paddingXSmall,
} from "../../../core/styles";
import { BadgeComponent } from "../../../components/badge.component";
import { League } from "../types";
import { LeagueDays } from "./league-days.component";

interface LeagueCardProps {
  league: League;
  isTonight: boolean;
  isMember: boolean;
  onPress: () => void;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({
  league,
  isTonight,
  isMember,
  onPress,
}) => {
  const { theme, isDark } = useTheme();

  const renderChevron = () => {
    return (
      <View
        style={[
          styles.chevronCircle,
          { backgroundColor: theme.colors.text + "15" },
        ]}
      >
        <Icon name="chevron-right" size={18} color={theme.colors.text} />
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.leagueCard} variant="elevated">
        {/* Top Section: Member Badge & Chevron */}
        {
          <View style={styles.topSection}>
            <View style={styles.badgeContainer}>
              {isMember && (
                <BadgeComponent
                  icon="check-circle"
                  text="Member"
                  color={theme.colors.success}
                />
              )}
              {!isMember && (
                <BadgeComponent
                  icon="plus-circle"
                  text="Can Join"
                  color={theme.colors.info}
                />
              )}
              {isTonight && (
                <BadgeComponent
                  icon="calendar"
                  text="Tonight"
                  // purple colour
                  color={theme.colors.accent}
                />
              )}
            </View>
            {renderChevron()}
          </View>
        }

        {/* Middle Section: League Name & Location */}
        <View style={styles.middleSection}>
          <View style={styles.leagueNameContainer}>
            <ThemedText textStyle={TextStyle.Body} style={styles.leagueName}>
              {league.name}
            </ThemedText>
          </View>
          {league.location && (
            <View style={styles.locationRow}>
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.locationText}
              >
                {league.location}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Bottom Section: Time, Days, Members */}
        <View style={styles.bottomSection}>
          <View style={[styles.bottomItem, styles.alignLeft]}>
            <View style={styles.bottomItemText}>
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.bottomText}
              >
                {league.startTime.split(":").slice(0, 2).join(":")}
              </ThemedText>
            </View>
            <ThemedText textStyle={TextStyle.BodySmall} muted>
              Start Time
            </ThemedText>
          </View>

          {league.leagueDays && league.leagueDays.length > 0 && (
            <LeagueDays leagueDays={league.leagueDays} />
          )}

          <View style={[styles.bottomItem, styles.alignRight]}>
            <View style={styles.bottomItemText}>
              <Icon name="users" size={12} color={theme.colors.text + "60"} />
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.bottomText}
              >
                {league.totalPlayers}
              </ThemedText>
            </View>

            <ThemedText textStyle={TextStyle.BodySmall} muted>
              Members
            </ThemedText>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  leagueCard: {
    marginBottom: spacing.lg,
    gap: gap.xs,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.xs,
  },
  chevronCircle: {
    width: 26,
    height: 26,
    borderRadius: roundingFull,
    justifyContent: "center",
    alignItems: "center",
  },
  middleSection: {
    marginBottom: spacing.lg,
    gap: gap.xs,
  },
  leagueNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: 26,
  },
  leagueName: {
    fontWeight: "700",
    fontSize: 18,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.xs,
  },
  locationText: {
    opacity: 0.6,
    fontSize: 13,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  bottomItem: {
    flexDirection: "column",
    alignItems: "center",
    gap: gap.xs,
  },
  bottomItemText: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.xs,
  },
  alignRight: {
    alignItems: "flex-end",
  },
  alignLeft: {
    alignItems: "flex-start",
  },
  alignCenter: {
    alignItems: "center",
  },
  bottomText: {
    opacity: 0.8,
    fontWeight: "600",
  },
});
