import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ThemedText, Button, Card } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { GlobalStyles, padding } from "../../../core/styles";
import type {
  CheckedInPlayer,
  PartnershipRequest,
  ConfirmedPartnership,
  LeagueNightInstance,
} from "../../../features/league-nights/types";
import type { League } from "../../../features/leagues/types";

interface MyNightTabProps {
  user: any;
  leagueId: number;
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
  acceptingRequest: number | null;
  rejectingRequest: number | null;
  removingPartnership: boolean;
  onCheckIn: () => void;
  onUncheck: () => void;
  onSendPartnershipRequest: (partnerId: string) => void;
  onAcceptPartnershipRequest: (requestId: number) => void;
  onRejectPartnershipRequest: (requestId: number) => void;
  onRemovePartnership: () => void;
  onScoreSubmitted: () => void;
}

export const MyNightTab: React.FC<MyNightTabProps> = ({
  user,
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

  // Filter available partners
  const availablePartners = useMemo(() => {
    if (!isCheckedIn) return [];

    return checkedInPlayers.filter((player) => {
      // Exclude self
      if (player.userId === user?.id) return false;

      // Exclude if already has partnership
      if (player.hasPartnership) return false;

      // Apply search filter
      if (searchQuery) {
        const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }, [checkedInPlayers, isCheckedIn, user, searchQuery]);

  // Get incoming requests
  const incomingRequests = useMemo(() => {
    return partnershipRequests.filter(
      (req) => req.requestedId === user?.id && req.status === "pending"
    );
  }, [partnershipRequests, user]);

  // Get outgoing requests
  const outgoingRequests = useMemo(() => {
    return partnershipRequests.filter(
      (req) => req.requesterId === user?.id && req.status === "pending"
    );
  }, [partnershipRequests, user]);

  // Render check-in section
  const renderCheckInSection = () => {
    if (!isCheckedIn) {
      return (
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="user-check" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">Check In</ThemedText>
          </View>
          <ThemedText styleType="Body" style={styles.cardDescription}>
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
          <ThemedText styleType="Subheader">You're Checked In!</ThemedText>
        </View>
        <ThemedText styleType="Body" style={styles.cardDescription}>
          {checkedInPlayers.length} {checkedInPlayers.length === 1 ? "player" : "players"} checked
          in
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
          <ThemedText styleType="BodySmall" style={styles.warningText}>
            Remove your partnership before checking out
          </ThemedText>
        )}
      </Card>
    );
  };

  // Render partnership section
  const renderPartnershipSection = () => {
    if (!isCheckedIn) return null;

    // If user has confirmed partnership
    if (confirmedPartnership) {
      const partner =
        confirmedPartnership.player1Id === user?.id
          ? confirmedPartnership.player2
          : confirmedPartnership.player1;

      return (
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="users" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">Your Partnership</ThemedText>
          </View>
          <View style={styles.partnerCard}>
            <View style={styles.partnerInfo}>
              <ThemedText styleType="BodyLarge" style={styles.partnerName}>
                {partner.firstName} {partner.lastName}
              </ThemedText>
              <ThemedText styleType="BodySmall" style={styles.partnerSkill}>
                Skill: {partner.skillLevel}
              </ThemedText>
            </View>
            <Button
              text="Remove"
              variant="ghost"
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
            <ThemedText styleType="Subheader">Partnership Requests</ThemedText>
          </View>
          {incomingRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestInfo}>
                <ThemedText styleType="Body">
                  {request.requesterName} wants to partner with you
                </ThemedText>
                <ThemedText styleType="BodySmall" style={styles.requestSkill}>
                  Skill: {request.requesterSkillLevel}
                </ThemedText>
              </View>
              <View style={styles.requestActions}>
                <Button
                  text="Accept"
                  size="small"
                  onPress={() => onAcceptPartnershipRequest(request.id)}
                  loading={acceptingRequest === request.id}
                  disabled={!!acceptingRequest}
                  leftIcon="check"
                />
                <Button
                  text="Decline"
                  variant="ghost"
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
            <Icon name="clock" size={24} color={theme.colors.primary} />
            <ThemedText styleType="Subheader">Pending Requests</ThemedText>
          </View>
          {outgoingRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestInfo}>
                <ThemedText styleType="Body">
                  Waiting for {request.requestedName} to respond
                </ThemedText>
                <ThemedText styleType="BodySmall" style={styles.requestSkill}>
                  Skill: {request.requestedSkillLevel}
                </ThemedText>
              </View>
            </View>
          ))}
        </Card>
      );
    }

    // Show available partners
    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="user-plus" size={24} color={theme.colors.primary} />
          <ThemedText styleType="Subheader">Find a Partner</ThemedText>
        </View>
        <ThemedText styleType="Body" style={styles.cardDescription}>
          {availablePartners.length} {availablePartners.length === 1 ? "player" : "players"}{" "}
          available
        </ThemedText>
        <FlatList
          data={availablePartners}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <View style={styles.partnerCard}>
              <View style={styles.partnerInfo}>
                <ThemedText styleType="Body">
                  {item.firstName} {item.lastName}
                </ThemedText>
                <ThemedText styleType="BodySmall" style={styles.partnerSkill}>
                  Skill: {item.skillLevel}
                </ThemedText>
              </View>
              <Button
                text="Request"
                size="small"
                onPress={() => onSendPartnershipRequest(item.userId)}
                loading={sendingRequest === item.userId}
                disabled={!!sendingRequest}
                leftIcon="send"
              />
            </View>
          )}
          scrollEnabled={false}
        />
      </Card>
    );
  };

  // Render current match section
  const renderCurrentMatchSection = () => {
    if (!currentMatch || !confirmedPartnership) return null;

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="trophy" size={24} color={theme.colors.primary} />
          <ThemedText styleType="Subheader">Current Match</ThemedText>
        </View>
        <View style={styles.matchInfo}>
          <ThemedText styleType="Body">Court {currentMatch.courtNumber}</ThemedText>
          <ThemedText styleType="BodySmall" style={styles.matchStatus}>
            Status: {currentMatch.status}
          </ThemedText>
        </View>
        {/* TODO: Add score submission component */}
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {renderCheckInSection()}
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
  },
  card: {
    ...GlobalStyles.padding,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardDescription: {
    opacity: 0.7,
  },
  button: {
    marginTop: 8,
  },
  warningText: {
    opacity: 0.7,
    textAlign: "center",
    marginTop: 4,
  },
  partnerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    marginBottom: 4,
  },
  partnerSkill: {
    opacity: 0.7,
  },
  requestCard: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    gap: 12,
  },
  requestInfo: {
    gap: 4,
  },
  requestSkill: {
    opacity: 0.7,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  matchInfo: {
    gap: 4,
  },
  matchStatus: {
    opacity: 0.7,
  },
});
