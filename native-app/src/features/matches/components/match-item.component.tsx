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
  MatchScoreStatus,
  MatchStatus,
} from "../../league-nights/types";
import { ProfileData } from "../../profiles/types";
import { TextStyle } from "../../../core/styles";
import { Icon } from "../../../icons";
import { BadgeComponent } from "../../../components/badge.component";
import { useTheme } from "../../../core/theme";
import { useAuthState } from "../../auth/state";
import { gap, padding } from "../../../core/styles/global";
import { memo, useMemo, useState } from "react";
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
  showAdminButtons: boolean;
  onMatchUpdated?: (match: Match) => void;
}

enum MatchAction {
  SUBMIT = "submit",
  CANCEL = "cancel",
  DISPUTE = "dispute",
  CONFIRM = "confirm",
  OVERRIDE = "override",
}

export const MatchItem: React.FC<MatchItemProps> = memo(({
  leagueId,
  leagueNightId,
  match,
  partnership1,
  partnership2,
  onMatchUpdated,
  showAdminButtons,
}) => {
  const { theme } = useTheme();
  const showToast = useToastState((state) => state.showToast);
  const user = useAuthState((state) => state.user);

  const [actioningMatchAction, setActioningMatchAction] =
    useState<MatchAction | null>(null);
  const [team1Score, setTeam1Score] = useState<string>(
    match.match.team1Score?.toString() ?? "00"
  );
  const [team2Score, setTeam2Score] = useState<string>(
    match.match.team2Score?.toString() ?? "00"
  );

  const isUserMatch = useMemo(() => {
    if (!user) return false;

    return (
      match.partnership1.player1Id === user.id ||
      match.partnership1.player2Id === user.id ||
      match.partnership2.player1Id === user.id ||
      match.partnership2.player2Id === user.id
    );
  }, [match, user]);

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

  const matchResult = useMemo(() => {
    if (match.match.status === MatchStatus.CANCELLED) {
      return "CANCELLED";
    }

    if (
      match.match.status === MatchStatus.ACTIVE ||
      match.match.scoreStatus !== MatchScoreStatus.CONFIRMED
    ) {
      return null;
    }

    if (match.match.team1Score === null || match.match.team2Score === null) {
      return null;
    }

    if (!isUserMatch || !user) {
      return null;
    }

    const userTeam =
      match.partnership1.player1Id === user.id ||
      match.partnership1.player2Id === user.id
        ? "1"
        : "2";

    const userScore =
      userTeam === "1" ? match.match.team1Score : match.match.team2Score;
    const opponentScore =
      userTeam === "1" ? match.match.team2Score : match.match.team1Score;

    if (userScore === opponentScore) {
      return "DRAW";
    }

    if (userScore > opponentScore) {
      return "WIN";
    }

    return "LOSS";
  }, [
    match.match.status,
    match.match.scoreStatus,
    match.match.team1Score,
    match.match.team2Score,
  ]);

  const handleTeam1ScoreChange = (text: string) => {
    setTeam1Score(text);
  };

  const handleTeam2ScoreChange = (text: string) => {
    setTeam2Score(text);
  };

  const handleMatchActionCall = async (
    action: MatchAction,
    apiCall: () => Promise<void>
  ) => {
    try {
      setActioningMatchAction(action);
      await apiCall();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast({
          title: `Error ${action} score`,
          message: error.message,
          type: "error",
        });
      }
    } finally {
      setActioningMatchAction(null);
    }
  };

  const handleSubmitScore = async () => {
    if (!user) return;

    const team1ScoreInt = parseInt(team1Score);
    const team2ScoreInt = parseInt(team2Score);

    if (isNaN(team1ScoreInt) || isNaN(team2ScoreInt)) {
      return;
    }

    await handleMatchActionCall(MatchAction.SUBMIT, async () => {
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

    await handleMatchActionCall(MatchAction.CANCEL, async () => {
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

    await handleMatchActionCall(MatchAction.DISPUTE, async () => {
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

    await handleMatchActionCall(MatchAction.CONFIRM, async () => {
      const response = await leagueNightsService.confirmMatchScore(
        leagueId,
        leagueNightId,
        match.match.id,
        user.id
      );
      onMatchUpdated?.(response.match);
    });
  };

  const handleOverrideScore = async () => {
    if (!user) return;

    await handleMatchActionCall(MatchAction.OVERRIDE, async () => {
      const response = await leagueNightsService.overrideMatchScore(
        leagueId,
        leagueNightId,
        match.match.id,
        user.id,
        parseInt(team1Score),
        parseInt(team2Score)
      );
      onMatchUpdated?.(response.match);
    });
  };

  const handleCancelMatch = async () => {
    if (!user) return;

    await handleMatchActionCall(MatchAction.CANCEL, async () => {
      const response = await leagueNightsService.cancelMatch(
        leagueId,
        leagueNightId,
        match.match.id,
        user.id
      );
      onMatchUpdated?.(response.match);
    });
  };

  const renderAdminButtons = () => {
    return (
      <Container>
        {match.match.status === "active" && (
          <Container row gap={gap.sm} w100>
            <Button
              title="Override Score"
              onPress={handleOverrideScore}
              style={styles.splitButton}
              variant="outline"
              loading={actioningMatchAction === MatchAction.OVERRIDE}
              disabled={actioningMatchAction !== null}
            />
            <Button
              title="Cancel Match"
              onPress={handleCancelMatch}
              style={styles.splitButton}
              variant="outline"
              loading={actioningMatchAction === MatchAction.CANCEL}
              disabled={actioningMatchAction !== null}
            />
          </Container>
        )}
      </Container>
    );
  };

  const renderSubmitScoreButton = () => {
    if (
      match.match.scoreStatus === "pending" ||
      match.match.scoreStatus === "confirmed"
    ) {
      return null;
    }

    if (match.match.status !== "active") {
      return null;
    }

    return (
      <Button
        title="Submit Score"
        onPress={handleSubmitScore}
        loading={actioningMatchAction === MatchAction.SUBMIT}
        style={styles.fullWidthButton}
        disabled={actioningMatchAction !== null}
      />
    );
  };

  const renderScoreActions = () => {
    if (match.match.scoreStatus !== "pending") {
      return null;
    }

    if (userSetScore) {
      return (
        <Button
          title="Cancel Score"
          onPress={handleCancelScore}
          loading={actioningMatchAction === MatchAction.CANCEL}
          variant="outline"
          style={styles.fullWidthButton}
          disabled={actioningMatchAction !== null}
        />
      );
    }

    return (
      <Container row gap={gap.sm} w100>
        <Button
          title="Dispute"
          onPress={handleDisputeScore}
          loading={actioningMatchAction === MatchAction.DISPUTE}
          variant="outline"
          style={styles.splitButton}
          disabled={actioningMatchAction !== null}
        />
        <Button
          title="Confirm Score"
          onPress={handleConfirmScore}
          loading={actioningMatchAction === MatchAction.CONFIRM}
          style={styles.splitButton}
          disabled={actioningMatchAction !== null}
        />
      </Container>
    );
  };

  const renderPendingScoreNotice = () => {
    if (match.match.pendingSubmittedByPartnershipId !== user?.id) {
      return null;
    }

    return (
      <View style={styles.pendingScoreNotice}>
        <Icon name="clock" size={16} color={theme.colors.warning} />
        <ThemedText
          textStyle={TextStyle.BodySmall}
          style={styles.pendingScoreText}
        >
          Score pending confirmation
        </ThemedText>
      </View>
    );
  };

  const renderButtons = () => {
    if (!isUserMatch) {
      return renderAdminButtons();
    }

    return (
      <Container column w100 gap={gap.sm}>
        {renderSubmitScoreButton()}
        {renderScoreActions()}
        {renderPendingScoreNotice()}
        {showAdminButtons && renderAdminButtons()}
      </Container>
    );
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
      <Container row w100 centerVertical gap={0}>
        <Container
          row
          centerVertical
          gap={gap.xs}
          style={{ ...styles.courtBadge, width: "33.333333%" }}
          startHorizontal
        >
          <Icon name="map-pin" size={16} color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.BodySmall} style={styles.courtText}>
            {match.courtLabel}
          </ThemedText>
        </Container>
        <Container row centerHorizontal style={{ width: "33.333333%" }}>
          <ThemedText
            textStyle={TextStyle.BodyMedium}
            style={{ textAlign: "center" }}
            color={
              matchResult === "WIN"
                ? theme.colors.success
                : matchResult === "LOSS"
                  ? theme.colors.error
                  : matchResult === "DRAW"
                    ? theme.colors.warning
                    : theme.colors.muted
            }
          >
            {matchResult}
          </ThemedText>
        </Container>
        <Container row endHorizontal style={{ width: "33.333333%" }}>
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
      </Container>

      {/* Teams + Score */}
      <Container row w100 centerVertical gap={0} spaceBetween>
        {renderPartnership(partnership1, "left")}

        <Container column centerHorizontal>
          {isUserMatch &&
          (match.match.scoreStatus === "none" ||
            match.match.scoreStatus === "disputed") &&
          match.match.status === "active" ? (
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
                  ? `${match.match.team1Score || "0"} - ${match.match.team2Score || "0"}`
                  : `${match.match.pendingTeam1Score || "0"} - ${match.match.pendingTeam2Score || "0"}`}
              </ThemedText>
            </Container>
          )}
        </Container>

        {renderPartnership(partnership2, "right")}
      </Container>

      {renderButtons()}

      <Container row w100 endHorizontal>
        <ThemedText textStyle={TextStyle.BodySmall} muted>
          {new Date(match.match.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </ThemedText>
      </Container>
    </Card>
  );
}) as React.FC<MatchItemProps>;

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
