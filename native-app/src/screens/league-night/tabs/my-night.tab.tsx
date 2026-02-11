import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { ThemedText, Button, Card } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { GlobalStyles, padding, TextStyle } from "../../../core/styles";
import type {
  CheckedInPlayer,
  PartnershipRequest,
  ConfirmedPartnership,
  LeagueNightInstance,
} from "../../../features/league-nights/types";
import type { League } from "../../../features/leagues/types";
import { leagueNightsService } from "../../../di/services.registry";

interface TonightStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalPoints: number;
  averagePoints: number;
}

export interface MyNightTabProps {
  user: any;
  leagueId: string;
  nightId: string;
  league: League | null;
  leagueNight: LeagueNightInstance;
  isCheckedIn: boolean;
  checkedInPlayers: CheckedInPlayer[];
  partnershipRequests: PartnershipRequest[];
  confirmedPartnership: ConfirmedPartnership | null;
  currentMatch: any | null;
  checkingIn: boolean;
  unchecking: boolean;
  sendingRequest: string | null;
  acceptingRequest: string | null;
  rejectingRequest: string | null;
  removingPartnership: boolean;
  onCheckIn: () => void;
  onUncheck: () => void;
  onSendPartnershipRequest: (partnerId: string) => void;
  onAcceptPartnershipRequest: (requestId: string) => void;
  onRejectPartnershipRequest: (requestId: string) => void;
  onRemovePartnership: () => void;
  onScoreSubmitted: () => void;
}

export const MyNightTab: React.FC<MyNightTabProps> = ({
  user,
  leagueId,
  nightId,
  isCheckedIn,
  checkedInPlayers,
  partnershipRequests,
  confirmedPartnership,
  currentMatch,
  checkingIn,
  unchecking,
  sendingRequest,
  acceptingRequest,
  rejectingRequest,
  removingPartnership,
  onCheckIn,
  onUncheck,
  onSendPartnershipRequest,
  onAcceptPartnershipRequest,
  onRejectPartnershipRequest,
  onRemovePartnership,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [tonightStats, setTonightStats] = useState<TonightStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch tonight's stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id || !isCheckedIn) return;

      setLoadingStats(true);
      try {
        const response = await leagueNightsService.getMyStats(
          leagueId,
          nightId,
          user.id
        );
        setTonightStats(response.stats);
      } catch (error) {
        console.error("Error fetching tonight's stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user?.id, leagueId, nightId, isCheckedIn, currentMatch]);

  // Filter available partners
  const availablePartners = useMemo(() => {
    if (!isCheckedIn) return [];

    return checkedInPlayers.filter((player) => {
      if (player.id === user?.id) return false;
      if (player.hasPartner) return false;

      if (searchQuery) {
        const fullName = `${player.name}`.toLowerCase();
        return (
          fullName.includes(searchQuery.toLowerCase()) ||
          player.skillLevel.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return true;
    });
  }, [checkedInPlayers, isCheckedIn, user, searchQuery]);

  // Get incoming requests
  const incomingRequests = useMemo(() => {
    console.log("incoming requests", partnershipRequests);
    return partnershipRequests.filter(
      (req) => req.requestedId === user?.id && req.status === "pending"
    );
  }, [partnershipRequests, user]);

  // Get outgoing requests
  const outgoingRequests = useMemo(() => {
    console.log("outgoing requests", partnershipRequests);
    return partnershipRequests.filter(
      (req) => req.requesterId === user?.id && req.status === "pending"
    );
  }, [partnershipRequests, user]);

  // Check if request sent to partner
  const hasSentRequest = (partnerId: string) => {
    return outgoingRequests.some((req) => req.requestedId === partnerId);
  };


  // Render check-in section
  const renderCheckedInSection = () => {
    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="check-circle" size={24} color={theme.colors.success} />
          <ThemedText textStyle={TextStyle.Subheader}>
            You're Checked In!
          </ThemedText>
        </View>
        <ThemedText textStyle={TextStyle.Body} style={styles.description}>
          {checkedInPlayers.length}{" "}
          {checkedInPlayers.length === 1 ? "player" : "players"} checked in
        </ThemedText>
        <Button
          text="Check Out"
          variant="outline"
          onPress={onUncheck}
          loading={unchecking}
          disabled={unchecking || !!confirmedPartnership}
          leftIcon="user-x"
          style={styles.button}
        />
        {confirmedPartnership && (
          <ThemedText textStyle={TextStyle.BodySmall} style={styles.warning}>
            Remove your partnership before checking out
          </ThemedText>
        )}
      </Card>
    );
  };

  // Render tonight's stats
  const renderTonightStats = () => {
    if (!isCheckedIn || !confirmedPartnership) return null;

    if (loadingStats) {
      return (
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="bar-chart" size={24} color={theme.colors.primary} />
            <ThemedText textStyle={TextStyle.Subheader}>
              Tonight's Stats
            </ThemedText>
          </View>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </Card>
      );
    }

    if (!tonightStats || tonightStats.gamesPlayed === 0) return null;

    const winRate =
      tonightStats.gamesPlayed > 0
        ? ((tonightStats.gamesWon / tonightStats.gamesPlayed) * 100).toFixed(0)
        : "0";

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="bar-chart" size={24} color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.Subheader}>
            Tonight's Stats
          </ThemedText>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <ThemedText textStyle={TextStyle.Header} style={styles.statValue}>
              {tonightStats.gamesPlayed}
            </ThemedText>
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={styles.statLabel}
            >
              Games
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText
              textStyle={TextStyle.Header}
              style={[styles.statValue, { color: theme.colors.success }]}
            >
              {winRate}%
            </ThemedText>
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={styles.statLabel}
            >
              Win Rate
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText textStyle={TextStyle.Header} style={styles.statValue}>
              {tonightStats.averagePoints.toFixed(1)}
            </ThemedText>
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={styles.statLabel}
            >
              Avg Points
            </ThemedText>
          </View>
        </View>
      </Card>
    );
  };

  // Render partnership section

  // Render current match section
  const renderCurrentMatchSection = () => {
    if (!currentMatch || !confirmedPartnership) return null;

    const scoreStatus = currentMatch.score_status || "none";
    const isUserPartnership =
      currentMatch.partnership1?.id === confirmedPartnership.id ||
      currentMatch.partnership2?.id === confirmedPartnership.id;

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="trophy" size={24} color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.Subheader}>Your Match</ThemedText>
        </View>

        <View
          style={[
            styles.matchCard,
            {
              backgroundColor: theme.colors.primary + "10",
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <View style={styles.matchHeader}>
            <View
              style={[
                styles.courtBadge,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={{ color: "#FFF", fontWeight: "700" }}
              >
                {currentMatch.court_label ||
                  `Court ${currentMatch.court_number}`}
              </ThemedText>
            </View>
            {scoreStatus === "pending" && (
              <View
                style={[styles.statusBadge, { backgroundColor: "#f59e0b" }]}
              >
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={{ color: "#FFF", fontSize: 11 }}
                >
                  Score Pending
                </ThemedText>
              </View>
            )}
            {scoreStatus === "disputed" && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: theme.colors.error },
                ]}
              >
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={{ color: "#FFF", fontSize: 11 }}
                >
                  Disputed
                </ThemedText>
              </View>
            )}
          </View>

          <View style={styles.matchTeams}>
            <View style={styles.matchTeam}>
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.teamLabel}
              >
                Your Team
              </ThemedText>
              <ThemedText textStyle={TextStyle.Body} style={styles.teamPlayers}>
                {confirmedPartnership.player1.firstName} &{" "}
                {confirmedPartnership.player2.firstName}
              </ThemedText>
            </View>
            <ThemedText
              textStyle={TextStyle.Header}
              style={{ color: theme.colors.text + "40" }}
            >
              vs
            </ThemedText>
            <View style={styles.matchTeam}>
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.teamLabel}
              >
                Opponents
              </ThemedText>
              <ThemedText textStyle={TextStyle.Body} style={styles.teamPlayers}>
                {/* TODO: Get opponent names from match data */}
                Opponents
              </ThemedText>
            </View>
          </View>

          {/* TODO: Add score submission component */}
          {scoreStatus === "none" && (
            <ThemedText textStyle={TextStyle.BodySmall} style={styles.helpText}>
              Submit your score when the match is complete
            </ThemedText>
          )}
        </View>
      </Card>
    );
  };

  const renderScreen = () => {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderCheckedInSection()}
          {renderTonightStats()}
          {renderPartnershipSection()}
          {renderCurrentMatchSection()}
        </View>
      </ScrollView>
    );
  };

  return <>{renderScreen()}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: padding,
    gap: 16,
    paddingBottom: 100,
  },
  card: {
    ...GlobalStyles.container,
    gap: 12,
  },
  description: {
    opacity: 0.7,
  },
  button: {
    marginTop: 8,
  },
  warning: {
    opacity: 0.7,
    textAlign: "center",
    marginTop: 4,
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    opacity: 0.7,
    fontSize: 11,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  partnerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  partnerListCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderBottomWidth: 1,
  },
  partnerInfo: {
    gap: 2,
  },
  partnerName: {
    fontWeight: "600",
  },
  partnerSkill: {
    opacity: 0.7,
    fontSize: 12,
  },
  requestCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  requestInfo: {
    gap: 4,
  },
  requestSkill: {
    opacity: 0.7,
    fontSize: 12,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    flex: 1,
  },
  helpText: {
    opacity: 0.6,
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    padding: 24,
    gap: 8,
  },
  emptyText: {
    opacity: 0.7,
    textAlign: "center",
  },
  emptySubtext: {
    opacity: 0.5,
    textAlign: "center",
    fontSize: 12,
  },
  matchCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  matchHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  courtBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchTeams: {
    gap: 8,
    alignItems: "center",
  },
  matchTeam: {
    gap: 4,
    alignItems: "center",
  },
  teamLabel: {
    opacity: 0.7,
    fontSize: 11,
  },
  teamPlayers: {
    fontWeight: "600",
    textAlign: "center",
  },
});
