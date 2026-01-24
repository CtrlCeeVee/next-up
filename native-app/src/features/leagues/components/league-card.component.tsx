import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText, Card } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { TextStyle, spacing, gap } from "../../../core/styles";
import { BadgeComponent } from "../../../components/badge.component";
import { League } from "../types";

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

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.leagueCard} variant="elevated">
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardTitleContainer}>
              <View style={styles.badgeContainer}>
                {isTonight && <BadgeComponent icon="zap" text="Tonight" />}
                {isMember && (
                  <BadgeComponent
                    icon="check-circle"
                    text="Member"
                    color={isDark ? "#6497f5" : "#2862c9"}
                  />
                )}
              </View>
              <ThemedText textStyle={TextStyle.Body} style={styles.leagueName}>
                {league.name}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          {league.leagueDays && league.leagueDays.length > 0 && (
            <View style={styles.infoRow}>
              <Icon
                name="calendar"
                size={16}
                color={theme.colors.text + "80"}
              />
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.infoText}
              >
                {league.leagueDays.join(", ")} •{" "}
                {league.startTime.split(":").slice(0, 2).join(":")}
              </ThemedText>
            </View>
          )}
          {league.location && (
            <View style={styles.infoRow}>
              <Icon name="map-pin" size={16} color={theme.colors.text + "80"} />
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.infoText}
              >
                {league.location}
              </ThemedText>
            </View>
          )}
          {league.totalPlayers !== undefined && (
            <View style={styles.infoRow}>
              <Icon name="users" size={16} color={theme.colors.text + "80"} />
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.infoText}
              >
                {league.totalPlayers} members
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.arrowContainer}>
          <Icon name="chevron-right" size={20} color={theme.colors.text} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  leagueCard: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: gap.md,
  },
  cardTitleContainer: {
    flex: 1,
    gap: gap.sm - 2,
    justifyContent: "center",
  },
  leagueName: {
    fontWeight: "700",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.xs,
  },
  description: {
    opacity: 0.7,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  infoContainer: {
    gap: gap.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
  },
  infoText: {
    opacity: 0.8,
  },
  arrowContainer: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
  },
});
