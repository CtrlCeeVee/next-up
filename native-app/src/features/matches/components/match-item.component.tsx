import { Alert, StyleSheet, View } from "react-native";
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
import { padding } from "../../../core/styles/global";
import { gap } from "../../../core/styles/global";
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
        style={{ alignItems: align === "left" ? "flex-start" : "flex-end" }}
      >
        <ThemedText textStyle={TextStyle.Body}>
          {partnership.profile1.firstName} {partnership.profile2.lastName}
        </ThemedText>
        <ThemedText textStyle={TextStyle.Body}>
          {partnership.profile2.firstName} {partnership.profile2.lastName}
        </ThemedText>
      </Container>
    );
  };

  return (
    <Card style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View style={styles.courtBadge}>
          <Icon name="map-pin" size={16} color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.BodySmall} style={styles.courtText}>
            {match.courtLabel}
          </ThemedText>
        </View>
        <BadgeComponent
          icon="clock"
          text={match.match.status === "active" ? "Active" : "Completed"}
          color={
            match.match.status === "active"
              ? theme.colors.success
              : theme.colors.text
          }
        ></BadgeComponent>
      </View>

      {/* Team 1 */}
      <Container row gap={gap.sm} w100 centerVertical spaceBetween>
        {renderPartnership(partnership1, "left")}
        <ThemedText textStyle={TextStyle.BodySmall}>VS</ThemedText>
        {renderPartnership(partnership2, "right")}
      </Container>

      <Container row grow w100 spaceBetween centerVertical>
        {match.match.scoreStatus === "none" ||
        match.match.scoreStatus === "disputed" ? (
          <Container row gap={gap.sm} centerVertical>
            <Input
              keyboardType="number-pad"
              selectTextOnFocus={true}
              onChangeText={handleTeam1ScoreChange}
            >
              {team1Score}
            </Input>
            <ThemedText textStyle={TextStyle.Body}>-</ThemedText>
            <Input
              keyboardType="number-pad"
              selectTextOnFocus={true}
              onChangeText={handleTeam2ScoreChange}
            >
              {team2Score}
            </Input>
          </Container>
        ) : (
          <Container row centerVertical>
            <ThemedText textStyle={TextStyle.Body} muted>
              Score:
            </ThemedText>
            <ThemedText textStyle={TextStyle.Body}>
              {match.match.pendingTeam1Score} - {match.match.pendingTeam2Score}
            </ThemedText>
          </Container>
        )}
        {match.match.scoreStatus === "pending" && (
          <Container row gap={gap.sm} centerVertical>
            {userSetScore ? (
              <Button
                title="Cancel Score"
                onPress={handleCancelScore}
                loading={actioningMatchScore}
              />
            ) : (
              <Container column>
                <Button
                  title="Dispute Score"
                  onPress={handleDisputeScore}
                  loading={actioningMatchScore}
                />
                <Button
                  title="Confirm Score"
                  onPress={handleConfirmScore}
                  loading={actioningMatchScore}
                />
              </Container>
            )}
          </Container>
        )}
        {match.match.scoreStatus === "none" && (
          <Container row gap={gap.sm} centerVertical>
            <Button
              title="Submit Score"
              onPress={handleSubmitScore}
              loading={actioningMatchScore}
            />
          </Container>
        )}
      </Container>

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
    width: 1,
    height: "100%",
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
