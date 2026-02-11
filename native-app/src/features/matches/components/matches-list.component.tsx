import React from "react";
import { View, ScrollView, StyleSheet, FlatList } from "react-native";
import { ThemedText, Card, Container } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { gap, padding, TextStyle } from "../../../core/styles";
import type { Match } from "../../league-nights/types";
import { useAuthState } from "../../auth/state";

interface MatchesQueueTabProps {
  matches: Match[];
}

export const MatchesList: React.FC<MatchesQueueTabProps> = ({ matches }) => {
  const { theme } = useTheme();

  const user = useAuthState((state) => state.user);

  const renderMatch = ({ item: match }: { item: Match }) => {
    const isUserMatch =
      match.team1_player1_id === user?.id ||
      match.team1_player2_id === user?.id ||
      match.team2_player1_id === user?.id ||
      match.team2_player2_id === user?.id;

    return (
      <Card style={styles.matchCard}>
        <View style={styles.matchHeader}>
          <View style={styles.courtBadge}>
            <Icon name="map-pin" size={16} color={theme.colors.primary} />
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={styles.courtText}
            >
              {match.court_label}
            </ThemedText>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  match.status === "in_progress"
                    ? theme.colors.success + "20"
                    : match.status === "completed"
                      ? theme.colors.text + "20"
                      : theme.colors.error + "20",
              },
            ]}
          >
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={styles.statusText}
            >
              {match.status.toUpperCase()}
            </ThemedText>
          </View>
        </View>

        {/* Team 1 */}
        <View style={styles.teamContainer}>
          <View style={styles.teamInfo}>
            <ThemedText textStyle={TextStyle.Body}>
              {match.team1_player1_id} {match.team1_player2_id}
            </ThemedText>
            <ThemedText textStyle={TextStyle.Body}>
              {match.team1_player2_id} {match.team1_player2_id}
            </ThemedText>
          </View>
          {match.team1_score !== undefined && (
            <ThemedText textStyle={TextStyle.Body} style={styles.score}>
              {match.team1_score}
            </ThemedText>
          )}
        </View>

        <View style={styles.divider} />

        {/* Team 2 */}
        <View style={styles.teamContainer}>
          <View style={styles.teamInfo}>
            <ThemedText textStyle={TextStyle.Body}>
              {match.team2_player1_id} {match.team2_player1_id}
            </ThemedText>
            <ThemedText textStyle={TextStyle.Body}>
              {match.team2_player2_id} {match.team2_player2_id}
            </ThemedText>
          </View>
          {match.team2_score !== undefined && (
            <ThemedText textStyle={TextStyle.Body} style={styles.score}>
              {match.team2_score}
            </ThemedText>
          )}
        </View>

        {match.pending_score_submitted_by === user?.id && (
          <View style={styles.pendingScoreNotice}>
            <Icon name="clock" size={16} color={theme.colors.warning} />
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={styles.pendingScoreText}
            >
              Score pending confirmation
            </ThemedText>
          </View>
        )}
      </Card>
    );
  };

  if (matches.length === 0) {
    return (
      <Container
        column
        gap={gap.md}
        centerHorizontal
        centerVertical
        growHorizontal
      >
        <Icon name="trophy" size={48} color={theme.colors.muted} />
        <ThemedText textStyle={TextStyle.Subheader} style={styles.emptyTitle}>
          No Matches
        </ThemedText>
      </Container>
    );
  }

  // Separate active and completed matches
  const activeMatches = matches.filter((m) => m.status === "in_progress");
  const completedMatches = matches.filter((m) => m.status === "completed");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {activeMatches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="trophy" size={20} color={theme.colors.primary} />
              <ThemedText textStyle={TextStyle.Subheader}>
                Active Matches
              </ThemedText>
            </View>
            <FlatList
              data={activeMatches}
              renderItem={renderMatch}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        )}

        {completedMatches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon
                name="check-circle"
                size={20}
                color={theme.colors.success}
              />
              <ThemedText textStyle={TextStyle.Subheader}>
                Completed Matches
              </ThemedText>
            </View>
            <FlatList
              data={completedMatches}
              renderItem={renderMatch}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
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
    gap: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
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
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  matchCard: {
    padding: padding,
    gap: 12,
    marginBottom: 12,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courtBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  courtText: {
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: "600",
  },
  teamContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamInfo: {
    flex: 1,
    gap: 4,
  },
  score: {
    fontSize: 24,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  pendingScoreNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  pendingScoreText: {
    opacity: 0.7,
  },
});
