import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { ThemedText, Card } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { GlobalStyles, padding } from "../../../core/styles";
import type { League } from "../../../features/leagues/types";
import type { LeagueNightInstance } from "../../../features/league-nights/types";

interface LeagueInfoTabProps {
  league: League | null;
  leagueNight: LeagueNightInstance;
}

export const LeagueInfoTab: React.FC<LeagueInfoTabProps> = ({ league, leagueNight }) => {
  const { theme } = useTheme();

  if (!league) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText styleType="Body">Loading league information...</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* League Info Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="info" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">League Information</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Icon name="users" size={18} color={theme.colors.text + "80"} />
              <ThemedText styleType="Body" style={styles.labelText}>
                League Name
              </ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.infoValue}>
              {league.name}
            </ThemedText>
          </View>

          {league.description && (
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Icon name="file-text" size={18} color={theme.colors.text + "80"} />
                <ThemedText styleType="Body" style={styles.labelText}>
                  Description
                </ThemedText>
              </View>
              <ThemedText styleType="Body" style={styles.infoValue}>
                {league.description}
              </ThemedText>
            </View>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Icon name="map-pin" size={18} color={theme.colors.text + "80"} />
              <ThemedText styleType="Body" style={styles.labelText}>
                Location
              </ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.infoValue}>
              {league.location}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Icon name="calendar" size={18} color={theme.colors.text + "80"} />
              <ThemedText styleType="Body" style={styles.labelText}>
                Schedule
              </ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.infoValue}>
              {league.leagueDays?.join(", ") || "No schedule set"}
            </ThemedText>
          </View>
        </Card>

        {/* Tonight's Info Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="calendar" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">Tonight's Information</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Icon name="calendar" size={18} color={theme.colors.text + "80"} />
              <ThemedText styleType="Body" style={styles.labelText}>
                Date
              </ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.infoValue}>
              {new Date(leagueNight.date).toLocaleDateString()}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Icon name="clock" size={18} color={theme.colors.text + "80"} />
              <ThemedText styleType="Body" style={styles.labelText}>
                Time
              </ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.infoValue}>
              {leagueNight.time}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Icon name="map-pin" size={18} color={theme.colors.text + "80"} />
              <ThemedText styleType="Body" style={styles.labelText}>
                Courts Available
              </ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.infoValue}>
              {leagueNight.courtsAvailable}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Icon name="user-check" size={18} color={theme.colors.text + "80"} />
              <ThemedText styleType="Body" style={styles.labelText}>
                Checked In
              </ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.infoValue}>
              {leagueNight.checkedInCount || 0} players
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Icon name="users" size={18} color={theme.colors.text + "80"} />
              <ThemedText styleType="Body" style={styles.labelText}>
                Partnerships
              </ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.infoValue}>
              {leagueNight.partnershipsCount || 0} confirmed
            </ThemedText>
          </View>
        </Card>

        {/* Rules & Guidelines Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="file-text" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">Rules & Guidelines</ThemedText>
          </View>

          <View style={styles.ruleItem}>
            <ThemedText styleType="Body" style={styles.ruleNumber}>
              1.
            </ThemedText>
            <ThemedText styleType="Body" style={styles.ruleText}>
              Check in when you arrive at the venue
            </ThemedText>
          </View>

          <View style={styles.ruleItem}>
            <ThemedText styleType="Body" style={styles.ruleNumber}>
              2.
            </ThemedText>
            <ThemedText styleType="Body" style={styles.ruleText}>
              Find a partner or wait to be paired
            </ThemedText>
          </View>

          <View style={styles.ruleItem}>
            <ThemedText styleType="Body" style={styles.ruleNumber}>
              3.
            </ThemedText>
            <ThemedText styleType="Body" style={styles.ruleText}>
              Games are played to 11 points, win by 2
            </ThemedText>
          </View>

          <View style={styles.ruleItem}>
            <ThemedText styleType="Body" style={styles.ruleNumber}>
              4.
            </ThemedText>
            <ThemedText styleType="Body" style={styles.ruleText}>
              Submit scores after each match
            </ThemedText>
          </View>

          <View style={styles.ruleItem}>
            <ThemedText styleType="Body" style={styles.ruleNumber}>
              5.
            </ThemedText>
            <ThemedText styleType="Body" style={styles.ruleText}>
              Be respectful and have fun!
            </ThemedText>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: padding,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    ...GlobalStyles.padding,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  infoRow: {
    gap: 8,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  labelText: {
    opacity: 0.7,
  },
  infoValue: {
    paddingLeft: 26,
    fontWeight: "500",
  },
  ruleItem: {
    flexDirection: "row",
    gap: 12,
  },
  ruleNumber: {
    fontWeight: "700",
    minWidth: 24,
  },
  ruleText: {
    flex: 1,
  },
});
