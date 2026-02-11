import {
  Container,
  LoadingSpinner,
  Refresh,
  ScrollArea,
  SearchBar,
} from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import {
  defaultIconSize,
  gap,
  paddingLarge,
  paddingSmall,
  TextStyle,
} from "../../../core/styles";
import { ThemedText } from "../../../components";
import { Button } from "../../../components";
import { useLeagueNightState } from "../state";
import { useAuthState } from "../../auth/state";
import { useEffect, useMemo, useState } from "react";
import { League } from "../../leagues/types";
import {
  CheckedInPlayer,
  LeagueNightInstance,
  PartnershipRequest,
  ConfirmedPartnership,
} from "../types";
import { LeagueMemberIconComponent } from "../../leagues/components/league-member-icon.component";
import {
  getService,
  InjectableType,
  leagueNightsService,
  useInjection,
} from "../../../di";
import { LeagueNightsService } from "../services";

interface SelectPartnershipComponentProps {
  league: League;
  night: LeagueNightInstance;
}

interface PlayerCardDetails {
  id: string;
  name: string;
  skillLevel: string;
}

export const SelectPartnershipComponent = ({
  league,
  night,
}: SelectPartnershipComponentProps) => {
  const { theme } = useTheme();
  const [partnerSearch, setPartnerSearch] = useState("");
  const user = useAuthState((state) => state.user);
  const checkInPlayer = useLeagueNightState((state) => state.checkInPlayer);
  const refreshCheckedInPlayers = useLeagueNightState(
    (state) => state.refreshCheckedInPlayers
  );
  const refreshPartnershipRequests = useLeagueNightState(
    (state) => state.refreshPartnershipRequests
  );
  const loadingPartnershipData = useLeagueNightState(
    (state) => state.loadingPartnershipData
  );
  const sendPartnershipRequest = useLeagueNightState(
    (state) => state.sendPartnershipRequest
  );
  const rejectPartnershipRequest = useLeagueNightState(
    (state) => state.rejectPartnershipRequest
  );
  const acceptPartnershipRequest = useLeagueNightState(
    (state) => state.acceptPartnershipRequest
  );
  const sentRequests = useLeagueNightState((state) => state.sentRequests);
  const receivedRequests = useLeagueNightState(
    (state) => state.receivedRequests
  );
  const confirmedPartnership = useLeagueNightState(
    (state) => state.confirmedPartnership
  );
  const removePartnership = useLeagueNightState(
    (state) => state.removePartnership
  );

  useEffect(() => {
    if (user?.id) {
      refreshPartnershipRequests(league.id, night.id, user.id);
      refreshCheckedInPlayers(league.id, night.id);
    }
  }, [user, league, night]);

  const checkedInPlayers = useLeagueNightState(
    (state) => state.checkedInPlayers
  );

  const isCheckedIn = useMemo(() => {
    if (!user) {
      return false;
    }
    return checkedInPlayers.some((player) => player.id === user.id);
  }, [checkedInPlayers, user]);

  const availablePartners = useMemo(() => {
    if (!user || !sentRequests || !receivedRequests) {
      return undefined;
    }
    return checkedInPlayers.filter(
      (player) =>
        player.id !== user.id &&
        !player.hasPartner &&
        !sentRequests.some((request) => request.requested.id === player.id) &&
        !receivedRequests.some((request) => request.requester.id === player.id)
    );
  }, [checkedInPlayers, user, sentRequests, receivedRequests]);

  const checkIn = () => {
    if (!user?.id) return;
    checkInPlayer(league.id, night.id, user.id);
  };

  const selectPartner = (player: CheckedInPlayer) => {
    if (!user?.id) return;
    sendPartnershipRequest(league.id, night.id, user.id, player.id);
  };

  const cancelRequest = (requestId: string) => {
    if (!user?.id) return;
    rejectPartnershipRequest(league.id, night.id, requestId, user.id);
  };

  const acceptRequest = (requestId: string) => {
    if (!user?.id) return;
    acceptPartnershipRequest(league.id, night.id, requestId, user.id);
  };

  const renderCheckInSection = () => {
    return (
      <Container column centerHorizontal grow gap={gap.md}>
        <Icon name="user-plus" size={24} color={theme.colors.success} />
        <ThemedText textStyle={TextStyle.Body} style={{ textAlign: "center" }}>
          Check in to tonight's league night to set up your partnership
        </ThemedText>
        <Button text="Check In" onPress={checkIn} />
      </Container>
    );
  };

  const renderPlayerCard = (
    player: PlayerCardDetails,
    actionText: string | undefined,
    onAction: () => void
  ) => {
    return (
      <Container
        row
        centerVertical
        spaceBetween
        w100
        gap={gap.md}
        padding={paddingSmall}
        style={{ borderBottomWidth: 1, borderColor: theme.colors.border }}
      >
        <Container row centerVertical gap={gap.lg}>
          <Icon name="user" size={18} color={theme.colors.primary} />
          <Container column startVertical>
            <ThemedText textStyle={TextStyle.Body}>{player.name}</ThemedText>
            <ThemedText
              textStyle={TextStyle.Body}
              style={{ color: theme.colors.muted }}
            >
              {player.skillLevel}
            </ThemedText>
          </Container>
        </Container>
        {actionText && (
          <Button
            text={actionText}
            onPress={onAction}
            variant="ghost"
            size="small"
          />
        )}
      </Container>
    );
  };

  const renderRequestsSection = (
    title: string,
    emptyText: string,
    requests: PartnershipRequest[],
    actionText: string,
    onAction: (requestId: string) => void
  ) => {
    return (
      <Container column w100>
        <ThemedText textStyle={TextStyle.Body}>{title}</ThemedText>
        <Container column padding={paddingSmall} w100>
          {requests.length > 0 ? (
            requests.map((request) =>
              renderPlayerCard(
                {
                  id: request.requested.id,
                  name:
                    request.requested.firstName +
                    " " +
                    request.requested.lastName,
                  skillLevel: request.requested.skillLevel,
                },
                undefined,
                () => onAction(request.id)
              )
            )
          ) : (
            <ThemedText
              textStyle={TextStyle.Body}
              style={{ color: theme.colors.muted }}
            >
              {emptyText}
            </ThemedText>
          )}
        </Container>
      </Container>
    );
  };

  const renderReceivedRequests = () => {
    return renderRequestsSection(
      "Received requests",
      "No received requests just yet.",
      receivedRequests,
      "Accept",
      acceptRequest
    );
  };

  const renderSentRequests = () => {
    return renderRequestsSection(
      "Sent requests",
      "No sent requests just yet.",
      sentRequests,
      "Cancel",
      cancelRequest
    );
  };

  const renderAvailablePartners = () => {
    if (!availablePartners) return null;

    return (
      <Container column>
        <Container column>
          <ThemedText textStyle={TextStyle.Body}>
            Select your partner
          </ThemedText>
          {availablePartners.length > 0 && (
            <SearchBar
              value={partnerSearch}
              onChangeText={(text) => setPartnerSearch(text)}
              placeholder="Search..."
            />
          )}
        </Container>
        <Container column padding={paddingSmall}>
          {availablePartners.length === 0 ? (
            <ThemedText
              textStyle={TextStyle.Body}
              style={{ color: theme.colors.muted }}
            >
              No available partners. Make sure your friends have checked in, or
              check your sent requests!
            </ThemedText>
          ) : (
            availablePartners.map((player) =>
              renderPlayerCard(player, "Select", () => selectPartner(player))
            )
          )}
        </Container>
      </Container>
    );
  };

  const renderConfirmedPartnershipSection = () => {
    if (!confirmedPartnership || !user) return null;

    const otherPlayer =
      confirmedPartnership.player1Id === user.id
        ? confirmedPartnership.player2
        : confirmedPartnership.player1;

    return (
      <Container column gap={gap.md}>
        <ThemedText textStyle={TextStyle.Body}>Current partner</ThemedText>
        <Container column spaceBetween>
          <Container column gap={gap.md}>
            {renderPlayerCard(
              {
                id: otherPlayer.id,
                name: otherPlayer.firstName + " " + otherPlayer.lastName,
                skillLevel: otherPlayer.skillLevel,
              },
              undefined,
              () => {}
            )}
            <ThemedText textStyle={TextStyle.Body} muted>
              Make sure to check the matches you are playing together. You can
              change your partner at any time.
            </ThemedText>
          </Container>
          <Button
            text="Change partner"
            style={{ width: "100%" }}
            onPress={() => {
              if (!user) return;
              removePartnership(league.id, night.id, user.id);
            }}
          />
        </Container>
      </Container>
    );
  };

  const renderCheckedInSection = () => {
    if (confirmedPartnership) {
      return renderConfirmedPartnershipSection();
    }

    return (
      <Container column grow gap={gap.md} w100>
        <SearchBar
          value={partnerSearch}
          onChangeText={(text) => setPartnerSearch(text)}
          placeholder="Search..."
        />
        <ScrollArea style={{ padding: 0, width: "100%" }}>
          {renderReceivedRequests()}
          {renderSentRequests()}
          {renderAvailablePartners()}
        </ScrollArea>
      </Container>
    );
  };

  const renderPartnershipSelectionSection = () => {
    return (
      <>{isCheckedIn ? renderCheckedInSection() : renderCheckInSection()}</>
    );
  };

  const renderLoadingSection = () => {
    return (
      <Container column centerHorizontal centerVertical w100 grow>
        <LoadingSpinner />
      </Container>
    );
  };

  return (
    <Container column grow w100>
      {loadingPartnershipData
        ? renderLoadingSection()
        : renderPartnershipSelectionSection()}
    </Container>
  );
};
