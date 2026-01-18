import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ThemedText, Button, Card } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { GlobalStyles, padding } from "../../../core/styles";
import { leagueNightsService } from "../../../di/services.registry";
import type { LeagueNightInstance } from "../../../features/league-nights/types";

interface Match {
  id: number;
  courtNumber: number;
  courtLabel?: string;
  status: "active" | "completed" | "cancelled";
  team1Score?: number;
  team2Score?: number;
  pendingTeam1Score?: number;
  pendingTeam2Score?: number;
  scoreStatus?: "none" | "pending" | "confirmed" | "disputed";
  createdAt: string;
  completedAt?: string;
  partnership1: {
    id: number;
    player1: { id: string; firstName: string; lastName: string; skillLevel: string };
    player2: { id: string; firstName: string; lastName: string; skillLevel: string };
  };
  partnership2: {
    id: number;
    player1: { id: string; firstName: string; lastName: string; skillLevel: string };
    player2: { id: string; firstName: string; lastName: string; skillLevel: string };
  };
}

interface MatchesQueueTabProps {
  user: any;
  leagueId: number;
  nightId: string;
  leagueNight: LeagueNightInstance;
  matchesRefreshTrigger: number;
}

export const MatchesQueueTab: React.FC<MatchesQueueTabProps> = ({
  user,
  leagueId,
  nightId,
  leagueNight,
  matchesRefreshTrigger,
}) => {
  const { theme } = useTheme();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const matchesData = await leagueNightsService.getMatches(leagueId, nightId);
      setMatches(matchesData);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [leagueId, nightId, matchesRefreshTrigger]);

  const renderMatch = ({ item: match }: { item: Match }) => {
    const isUserMatch =
      match.partnership1.player1.id === user?.id ||
      match.partnership1.player2.id === user?.id ||
      match.partnership2.player1.id === user?.id ||
      match.partnership2.player2.id === user?.id;

    return (
      <Card
        style={[
          styles.matchCard,
          isUserMatch && { borderColor: theme.colors.primary, borderWidth: 2 },
        ]}
      >
        <View style={styles.matchHeader}>
          <View style={styles.courtBadge}>
            <Icon name="map-pin" size={16} color={theme.colors.primary} />
            <ThemedText styleType="BodySmall" style={styles.courtText}>
              {match.courtLabel || `Court ${match.courtNumber}`}
            </ThemedText>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  match.status === "active"
                    ? theme.colors.success + "20"
                    : match.status === "completed"
                    ? theme.colors.text + "20"
                    : theme.colors.error + "20",
              },
            ]}
          >
            <ThemedText styleType="BodySmall" style={styles.statusText}>
              {match.status.toUpperCase()}
            </ThemedText>
          </View>
        </View>

        {/* Team 1 */}
        <View style={styles.teamContainer}>
          <View style={styles.teamInfo}>
            <ThemedText styleType="Body">
              {match.partnership1.player1.firstName} {match.partnership1.player1.lastName}
            </ThemedText>
            <ThemedText styleType="Body">
              {match.partnership1.player2.firstName} {match.partnership1.player2.lastName}
            </ThemedText>
          </View>
          {match.team1Score !== undefined && (
            <ThemedText styleType="BodyLarge" style={styles.score}>
              {match.team1Score}
            </ThemedText>
          )}
        </View>

        <View style={styles.divider} />

        {/* Team 2 */}
        <View style={styles.teamContainer}>
          <View style={styles.teamInfo}>
            <ThemedText styleType="Body">
              {match.partnership2.player1.firstName} {match.partnership2.player1.lastName}
            </ThemedText>
            <ThemedText styleType="Body">
              {match.partnership2.player2.firstName} {match.partnership2.player2.lastName}
            </ThemedText>
          </View>
          {match.team2Score !== undefined && (
            <ThemedText styleType="BodyLarge" style={styles.score}>
              {match.team2Score}
            </ThemedText>
          )}
        </View>

        {match.scoreStatus === "pending" && (
          <View style={styles.pendingScoreNotice}>
            <Icon name="clock" size={16} color={theme.colors.warning} />
            <ThemedText styleType="BodySmall" style={styles.pendingScoreText}>
              Score pending confirmation
            </ThemedText>
          </View>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText styleType="Body" style={styles.loadingText}>
          Loading matches...
        </ThemedText>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="trophy" size={48} color={theme.colors.text + "40"} />
        <ThemedText styleType="Subheader" style={styles.emptyTitle}>
          No Matches Yet
        </ThemedText>
        <ThemedText styleType="Body" style={styles.emptyDescription}>
          Matches will appear here once they're created
        </ThemedText>
      </View>
    );
  }

  // Separate active and completed matches
  const activeMatches = matches.filter((m) => m.status === "active");
  const completedMatches = matches.filter((m) => m.status === "completed");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {activeMatches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="trophy" size={20} color={theme.colors.primary} />
              <ThemedText styleType="Subheader">Active Matches</ThemedText>
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
              <Icon name="check-circle" size={20} color={theme.colors.success} />
              <ThemedText styleType="Subheader">Completed Matches</ThemedText>
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
    ...GlobalStyles.padding,
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
