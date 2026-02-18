import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Container,
  Input,
  ThemedText,
} from "../../../components";
import {
  ConfirmedPartnership,
  GetMatchResponse,
  Match,
} from "../../league-nights/types";
import { ProfileData } from "../../profiles/types";
import { TextStyle } from "../../../core/styles";
import { Icon } from "../../../icons";
import { BadgeComponent } from "../../../components/badge.component";
import { useTheme } from "../../../core/theme";
import { useAuthState } from "../../auth/state";
import { gap, padding } from "../../../core/styles/global";
import { useMemo, useState } from "react";
import { leagueNightsService } from "../../../di";
import { useToastState } from "../../toast/state";
import { ApiError } from "../../../core/models";

interface PartnershipProps {
  partnership: ConfirmedPartnership;
  profile1: ProfileData;
  profile2: ProfileData;
}

export interface MatchItemProps {
  leagueId: string;
  leagueNightId: string;
  match: GetMatchResponse;
  partnership1: PartnershipProps;
  partnership2: PartnershipProps;
  onMatchUpdated?: (match: Match) => void;
}

export const MatchItem: React.FC<MatchItemProps> = ({
  leagueId,
  leagueNightId,
  match,
  partnership1,
  partnership2,
  onMatchUpdated,
}) => {
  const { theme } = useTheme();
  const showToast = useToastState((state) => state.showToast);
  const user = useAuthState((state) => state.user);

  const [actioningMatchScore, setActioningMatchScore] =
    useState<boolean>(false);
  const [team1Score, setTeam1Score] = useState<string>(
    match.match.team1Score?.toString() ?? "00"
  );
  const [team2Score, setTeam2Score] = useState<string>(
    match.match.team2Score?.toString() ?? "00"
  );

  const userSetScore = useMemo(() => {
    if (!user) return false;
    return (
      (match.match.pendingSubmittedByPartnershipId === match.partnership1.id &&
        (user.id === match.partnership1.player1Id ||
          user.id === match.partnership1.player2Id)) ||
      (match.match.pendingSubmittedByPartnershipId === match.partnership2.id &&
        (user.id === match.partnership2.player1Id ||
          user.id === match.partnership2.player2Id))
    );
  }, [match, user]);

  const handleTeam1ScoreChange = (text: string) => {
    setTeam1Score(text);
  };

  const handleTeam2ScoreChange = (text: string) => {
    setTeam2Score(text);
  };

  const handleMatchActionCall = async (apiCall: () => Promise<void>) => {
    try {
      setActioningMatchScore(true);
      await apiCall();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast({
          title: "Error submitting score",
          message: error.message,
          type: "error",
        });
      }
    } finally {
      setActioningMatchScore(false);
    }
  };

  const handleSubmitScore = async () => {
    if (!user) return;

    const team1ScoreInt = parseInt(team1Score);
    const team2ScoreInt = parseInt(team2Score);

    if (isNaN(team1ScoreInt) || isNaN(team2ScoreInt)) {
      return;
    }

    await handleMatchActionCall(async () => {
      const response = await leagueNightsService.submitMatchScore(
        leagueId,
        leagueNightId,
        match.match.id,
        team1ScoreInt,
        team2ScoreInt,
        user.id
      );
      onMatchUpdated?.(response.match);
    });
  };

  const handleCancelScore = async () => {
    if (!user) return;

    await handleMatchActionCall(async () => {
      const response = await leagueNightsService.cancelMatchScore(
        leagueId,
        leagueNightId,
        match.match.id,
        user.id
      );
      onMatchUpdated?.(response.match);
    });
  };

  const handleDisputeScore = async () => {
    if (!user) return;

    await handleMatchActionCall(async () => {
      const response = await leagueNightsService.disputeMatchScore(
        leagueId,
        leagueNightId,
        match.match.id,
        user.id
      );
      onMatchUpdated?.(response.match);
    });
  };

  const handleConfirmScore = async () => {
    if (!user) return;

    await handleMatchActionCall(async () => {
      const response = await leagueNightsService.confirmMatchScore(
        leagueId,
        leagueNightId,
        match.match.id,
        user.id
      );
      onMatchUpdated?.(response.match);
    });
  };

  const renderPartnership = (
    partnership: PartnershipProps,
    align: "left" | "right"
  ) => {
    return (
      <Container
        column
        w100
        grow
        style={{
          ...styles.teamContainer,
          alignItems: align === "left" ? "flex-start" : "flex-end",
        }}
      >
        <ThemedText
          textStyle={TextStyle.BodySmall}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.playerName}
        >
          {partnership.profile1.firstName} {partnership.profile1.lastName}
        </ThemedText>
        <ThemedText
          textStyle={TextStyle.BodySmall}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.playerName}
        >
          {partnership.profile2.firstName} {partnership.profile2.lastName}
        </ThemedText>
      </Container>
    );
  };

  return (
    <Card style={styles.matchCard}>
      {/* Header */}
      <Container row w100 centerVertical spaceBetween>
        <Container row centerVertical gap={gap.xs} style={styles.courtBadge}>
          <Icon name="map-pin" size={16} color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.BodySmall} style={styles.courtText}>
            {match.courtLabel}
          </ThemedText>
        </Container>
        <BadgeComponent
          icon={match.match.status === "active" ? "clock" : "check-circle"}
          text={match.match.status === "active" ? "Active" : "Completed"}
          color={
            match.match.status === "active"
              ? theme.colors.accent
              : theme.colors.success
          }
        />
      </Container>

      {/* Teams + Score */}
      <Container row w100 centerVertical gap={0}>
        {renderPartnership(partnership1, "left")}

        <View style={styles.scoreCenter}>
          {match.match.scoreStatus === "none" ||
          match.match.scoreStatus === "disputed" ? (
            <Container row gap={gap.sm} centerVertical>
              <Input
                keyboardType="number-pad"
                selectTextOnFocus={true}
                onChangeText={handleTeam1ScoreChange}
                style={styles.scoreInput}
                containerStyle={styles.scoreInputContainer}
                defaultValue={team1Score}
              />
              <ThemedText textStyle={TextStyle.Body} style={styles.scoreDash}>
                -
              </ThemedText>
              <Input
                keyboardType="number-pad"
                selectTextOnFocus={true}
                onChangeText={handleTeam2ScoreChange}
                style={styles.scoreInput}
                containerStyle={styles.scoreInputContainer}
                defaultValue={team2Score}
              />
            </Container>
          ) : (
            <Container column centerHorizontal gap={gap.xs}>
              <ThemedText textStyle={TextStyle.Caption} muted>
                Score
              </ThemedText>
              <ThemedText textStyle={TextStyle.Subheader}>
                {match.match.scoreStatus === "confirmed"
                  ? `${match.match.team1Score} - ${match.match.team2Score}`
                  : `${match.match.pendingTeam1Score} - ${match.match.pendingTeam2Score}`}
              </ThemedText>
            </Container>
          )}
        </View>

        {renderPartnership(partnership2, "right")}
      </Container>

      {/* Actions */}
      {(match.match.scoreStatus === "none" ||
        match.match.scoreStatus === "disputed") && (
        <Button
          title="Submit Score"
          onPress={handleSubmitScore}
          loading={actioningMatchScore}
          style={styles.fullWidthButton}
        />
      )}

      {match.match.scoreStatus === "pending" &&
        (userSetScore ? (
          <Button
            title="Cancel Score"
            onPress={handleCancelScore}
            loading={actioningMatchScore}
            variant="outline"
            style={styles.fullWidthButton}
          />
        ) : (
          <Container row gap={gap.sm} w100>
            <Button
              title="Dispute"
              onPress={handleDisputeScore}
              loading={actioningMatchScore}
              variant="outline"
              style={styles.splitButton}
            />
            <Button
              title="Confirm Score"
              onPress={handleConfirmScore}
              loading={actioningMatchScore}
              style={styles.splitButton}
            />
          </Container>
        ))}

      {match.match.pendingSubmittedByPartnershipId === user?.id && (
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

const styles = StyleSheet.create({
  matchCard: {
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
  teamContainer: {
    flex: 1,
    flexShrink: 1,
    gap: 2,
    minWidth: 0,
  },
  playerName: {
    flexShrink: 1,
  },
  scoreCenter: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: gap.sm,
  },
  scoreInput: {
    width: 45,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    borderWidth: 0,
    borderBottomWidth: 3,
    borderRadius: 0,
  },
  scoreInputContainer: {
    marginBottom: 0,
    padding: 0,
  },
  scoreDash: {
    fontWeight: "600",
  },
  fullWidthButton: {
    width: "100%",
  },
  splitButton: {
    flex: 1,
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
