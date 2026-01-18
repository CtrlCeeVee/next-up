import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { ThemedText, Button, Card } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { GlobalStyles, padding } from "../../../core/styles";
import { leagueNightsService } from "../../../di/services.registry";
import type { LeagueNightInstance } from "../../../features/league-nights/types";

interface AdminTabProps {
  user: any;
  leagueId: number;
  nightId: string;
  leagueNight: LeagueNightInstance;
  isAdmin: boolean;
  startingLeague: boolean;
  endingLeague: boolean;
  onStartLeague: () => void;
  onEndLeague: () => void;
  onMatchesCreated: () => void;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  user,
  leagueId,
  nightId,
  leagueNight,
  isAdmin,
  startingLeague,
  endingLeague,
  onStartLeague,
  onEndLeague,
  onMatchesCreated,
}) => {
  const { theme } = useTheme();
  const [creatingMatches, setCreatingMatches] = useState(false);

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="shield-alert" size={48} color={theme.colors.text + "40"} />
          <ThemedText styleType="Subheader" style={styles.emptyTitle}>
            Admin Access Required
          </ThemedText>
          <ThemedText styleType="Body" style={styles.emptyDescription}>
            You need admin privileges to access this section
          </ThemedText>
        </View>
      </View>
    );
  }

  const handleCreateMatches = async () => {
    Alert.alert(
      "Create Matches",
      "This will create matches for all confirmed partnerships. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Create",
          onPress: async () => {
            try {
              setCreatingMatches(true);
              await leagueNightsService.createMatches(leagueId, nightId);
              onMatchesCreated();
              Alert.alert("Success", "Matches created successfully!");
            } catch (error) {
              console.error("Error creating matches:", error);
              Alert.alert("Error", "Failed to create matches");
            } finally {
              setCreatingMatches(false);
            }
          },
        },
      ]
    );
  };

  const handleStartLeague = () => {
    Alert.alert(
      "Start League Night",
      "This will activate the league night and allow match play. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Start",
          onPress: onStartLeague,
        },
      ]
    );
  };

  const handleEndLeague = () => {
    Alert.alert(
      "End League Night",
      "This will end the league night and complete all active matches. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "End",
          style: "destructive",
          onPress: onEndLeague,
        },
      ]
    );
  };

  const isScheduled = leagueNight.status === "scheduled";
  const isActive = leagueNight.status === "active";
  const isCompleted = leagueNight.status === "completed";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Status Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="settings" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">League Night Status</ThemedText>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  isActive
                    ? theme.colors.success + "20"
                    : isCompleted
                    ? theme.colors.text + "20"
                    : theme.colors.primary + "20",
              },
            ]}
          >
            <ThemedText styleType="Body" style={styles.statusText}>
              {leagueNight.status.toUpperCase()}
            </ThemedText>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText styleType="BodyLarge" style={styles.statValue}>
                {leagueNight.checkedInCount || 0}
              </ThemedText>
              <ThemedText styleType="BodySmall" style={styles.statLabel}>
                Checked In
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText styleType="BodyLarge" style={styles.statValue}>
                {leagueNight.partnershipsCount || 0}
              </ThemedText>
              <ThemedText styleType="BodySmall" style={styles.statLabel}>
                Partnerships
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText styleType="BodyLarge" style={styles.statValue}>
                {leagueNight.possibleGames || 0}
              </ThemedText>
              <ThemedText styleType="BodySmall" style={styles.statLabel}>
                Possible Games
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Actions Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="zap" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">Admin Actions</ThemedText>
          </View>

          {isScheduled && (
            <>
              <ThemedText styleType="Body" style={styles.actionDescription}>
                Start the league night when players have arrived and checked in
              </ThemedText>
              <Button
                text="Start League Night"
                onPress={handleStartLeague}
                loading={startingLeague}
                disabled={startingLeague}
                leftIcon="play"
                style={styles.button}
              />
            </>
          )}

          {isActive && (
            <>
              <ThemedText styleType="Body" style={styles.actionDescription}>
                Create matches for all confirmed partnerships
              </ThemedText>
              <Button
                text="Create Matches"
                onPress={handleCreateMatches}
                loading={creatingMatches}
                disabled={creatingMatches || (leagueNight.partnershipsCount || 0) < 2}
                leftIcon="plus"
                style={styles.button}
              />

              <View style={styles.divider} />

              <ThemedText styleType="Body" style={styles.actionDescription}>
                End the league night when all matches are complete
              </ThemedText>
              <Button
                text="End League Night"
                variant="outline"
                onPress={handleEndLeague}
                loading={endingLeague}
                disabled={endingLeague}
                leftIcon="stop-circle"
                style={styles.button}
              />
            </>
          )}

          {isCompleted && (
            <View style={styles.completedContainer}>
              <Icon name="check-circle" size={48} color={theme.colors.success} />
              <ThemedText styleType="Body" style={styles.completedText}>
                This league night has ended
              </ThemedText>
            </View>
          )}
        </Card>

        {/* Court Management Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="map-pin" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">Court Management</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText styleType="Body" style={styles.infoLabel}>
              Courts Available:
            </ThemedText>
            <ThemedText styleType="Body" style={styles.infoValue}>
              {leagueNight.courtsAvailable}
            </ThemedText>
          </View>

          {leagueNight.courtLabels && leagueNight.courtLabels.length > 0 && (
            <View style={styles.courtLabelsContainer}>
              {leagueNight.courtLabels.map((label, index) => (
                <View key={index} style={styles.courtLabel}>
                  <ThemedText styleType="BodySmall">{label}</ThemedText>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Settings Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="sliders" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">Settings</ThemedText>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText styleType="Body">Auto-Assignment</ThemedText>
              <ThemedText styleType="BodySmall" style={styles.settingDescription}>
                Automatically assign players to courts
              </ThemedText>
            </View>
            <ThemedText styleType="Body" style={styles.settingValue}>
              {leagueNight.autoAssignmentEnabled ? "Enabled" : "Disabled"}
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
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    opacity: 0.7,
    textAlign: "center",
  },
  card: {
    ...GlobalStyles.padding,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statusText: {
    fontWeight: "700",
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    opacity: 0.7,
  },
  actionDescription: {
    opacity: 0.7,
  },
  button: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 8,
  },
  completedContainer: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  completedText: {
    opacity: 0.7,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    opacity: 0.7,
  },
  infoValue: {
    fontWeight: "600",
  },
  courtLabelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  courtLabel: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  settingDescription: {
    opacity: 0.7,
  },
  settingValue: {
    fontWeight: "600",
  },
});
