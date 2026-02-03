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
      (req) => req.requested_id === user?.id && req.status === "pending"
    );
  }, [partnershipRequests, user]);

  // Get outgoing requests
  const outgoingRequests = useMemo(() => {
    console.log("outgoing requests", partnershipRequests);
    return partnershipRequests.filter(
      (req) => req.requester_id === user?.id && req.status === "pending"
    );
  }, [partnershipRequests, user]);

  // Check if request sent to partner
  const hasSentRequest = (partnerId: string) => {
    return outgoingRequests.some((req) => req.requested_id === partnerId);
  };

  // Render check-in section
  const renderCheckInSection = () => {
    if (!isCheckedIn) {
      return (
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="user-check" size={24} color={theme.colors.primary} />
            <ThemedText textStyle={TextStyle.Subheader}>Check In</ThemedText>
          </View>
          <ThemedText textStyle={TextStyle.Body} style={styles.description}>
            Check in to let others know you're here and ready to play!
          </ThemedText>
          <Button
            text="Check In"
            onPress={onCheckIn}
            loading={checkingIn}
            disabled={checkingIn}
            leftIcon="user-check"
            style={styles.button}
          />
        </Card>
      );
    }

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
  const renderPartnershipSection = () => {
    if (!isCheckedIn) return null;

    // If user has confirmed partnership
    if (confirmedPartnership) {
      const partner =
        confirmedPartnership.player1_id === user?.id
          ? confirmedPartnership.player2
          : confirmedPartnership.player1;

      return (
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="users" size={24} color={theme.colors.primary} />
            <ThemedText textStyle={TextStyle.Subheader}>
              Your Partnership
            </ThemedText>
          </View>
          <View
            style={[
              styles.partnerCard,
              {
                backgroundColor: theme.colors.success + "20",
                borderColor: theme.colors.success + "40",
              },
            ]}
          >
            <View style={styles.partnerInfo}>
              <ThemedText textStyle={TextStyle.Body} style={styles.partnerName}>
                {partner.first_name} {partner.last_name}
              </ThemedText>
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.partnerSkill}
              >
                Skill: {partner.skill_level}
              </ThemedText>
            </View>
            <Button
              text="Remove"
              variant="outline"
              onPress={onRemovePartnership}
              loading={removingPartnership}
              disabled={removingPartnership}
              leftIcon="x"
              size="small"
            />
          </View>
        </Card>
      );
    }

    // Show incoming requests
    if (incomingRequests.length > 0) {
      return (
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="bell" size={24} color={theme.colors.primary} />
            <ThemedText textStyle={TextStyle.Subheader}>
              Partnership Requests
            </ThemedText>
          </View>
          {incomingRequests.map((request) => (
            <View
              key={request.id}
              style={[
                styles.requestCard,
                {
                  backgroundColor: theme.colors.primary + "10",
                  borderColor: theme.colors.primary + "30",
                },
              ]}
            >
              <View style={styles.requestInfo}>
                <ThemedText textStyle={TextStyle.Body}>
                  {request.requester.first_name} {request.requester.last_name}{" "}
                  wants to partner with you
                </ThemedText>
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.requestSkill}
                >
                  Skill: {request.requester.skill_level}
                </ThemedText>
              </View>
              <View style={styles.requestActions}>
                <Button
                  text="Accept"
                  size="small"
                  onPress={() => onAcceptPartnershipRequest(request.id)}
                  loading={acceptingRequest === request.id}
                  disabled={!!acceptingRequest}
                  leftIcon="check-circle"
                  style={styles.acceptButton}
                />
                <Button
                  text="Decline"
                  variant="outline"
                  size="small"
                  onPress={() => onRejectPartnershipRequest(request.id)}
                  loading={rejectingRequest === request.id}
                  disabled={!!rejectingRequest}
                  leftIcon="x"
                />
              </View>
            </View>
          ))}
        </Card>
      );
    }

    // Show outgoing requests
    if (outgoingRequests.length > 0) {
      return (
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="clock" size={24} color={theme.colors.text + "80"} />
            <ThemedText textStyle={TextStyle.Subheader}>
              Pending Requests
            </ThemedText>
          </View>
          {outgoingRequests.map((request) => (
            <View
              key={request.id}
              style={[
                styles.requestCard,
                {
                  backgroundColor: theme.colors.text + "05",
                  borderColor: theme.colors.text + "10",
                },
              ]}
            >
              <View style={styles.requestInfo}>
                <ThemedText textStyle={TextStyle.Body}>
                  Waiting for {request.requested.first_name}{" "}
                  {request.requested.last_name} to respond
                </ThemedText>
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.requestSkill}
                >
                  Skill: {request.requested.skill_level}
                </ThemedText>
              </View>
              <Icon name="clock" size={20} color={theme.colors.text + "60"} />
            </View>
          ))}
          <ThemedText textStyle={TextStyle.BodySmall} style={styles.helpText}>
            You can search for other partners below while waiting
          </ThemedText>
        </Card>
      );
    }

    // Show available partners
    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="user-add" size={24} color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.Subheader}>
            Find a Partner
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.componentBackground,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Icon name="search" size={16} color={theme.colors.text + "60"} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search by name or skill level..."
            placeholderTextColor={theme.colors.text + "60"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ThemedText textStyle={TextStyle.BodySmall} style={styles.description}>
          {availablePartners.length}{" "}
          {availablePartners.length === 1 ? "player" : "players"} available
        </ThemedText>

        {availablePartners.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="users" size={32} color={theme.colors.text + "40"} />
            <ThemedText textStyle={TextStyle.Body} style={styles.emptyText}>
              {searchQuery
                ? "No players match your search"
                : "No available partners yet"}
            </ThemedText>
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={styles.emptySubtext}
            >
              {searchQuery
                ? "Try a different search"
                : "More players may check in soon!"}
            </ThemedText>
          </View>
        ) : (
          <FlatList
            style={{
              width: "100%",
            }}
            data={availablePartners}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const requestSent = hasSentRequest(item.id);
              return (
                <View
                  style={[
                    styles.partnerListCard,
                    {
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.partnerInfo}>
                    <ThemedText textStyle={TextStyle.Body}>
                      {item.name}
                    </ThemedText>
                    <ThemedText
                      textStyle={TextStyle.BodySmall}
                      style={styles.partnerSkill}
                    >
                      Skill: {item.skillLevel}
                    </ThemedText>
                  </View>
                  <Button
                    text={requestSent ? "Sent" : "Request"}
                    size="small"
                    variant={requestSent ? "outline" : "primary"}
                    onPress={() => onSendPartnershipRequest(item.id)}
                    loading={sendingRequest === item.id}
                    disabled={!!sendingRequest || requestSent}
                    leftIcon={requestSent ? "clock" : "send"}
                  />
                </View>
              );
            }}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        )}

        <ThemedText textStyle={TextStyle.BodySmall} style={styles.helpText}>
          Don't see your partner? They may already be paired or not checked in
          yet.
        </ThemedText>
      </Card>
    );
  };

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
                {confirmedPartnership.player1.first_name} &{" "}
                {confirmedPartnership.player2.first_name}
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {renderCheckInSection()}
        {renderTonightStats()}
        {renderPartnershipSection()}
        {renderCurrentMatchSection()}
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
    paddingBottom: 100,
  },
  card: {
    ...GlobalStyles.container,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
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
