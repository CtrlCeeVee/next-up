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
import { PlayerList } from "./player-list.component";
import { PlayerListItem } from "./player-list-item.component";

interface SelectPartnershipComponentProps {
  league: League;
  night: LeagueNightInstance;
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
  const sendingRequest = useLeagueNightState((state) => state.sendingRequest);
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
    if (!user) return;
    checkInPlayer(league.id, night.id, user.id);
  };

  const selectPartner = (playerId: string) => {
    if (!user) return;
    sendPartnershipRequest(league.id, night.id, user.id, playerId);
  };

  const cancelRequest = (requestId: string) => {
    if (!user) return;
    rejectPartnershipRequest(league.id, night.id, requestId, user.id);
  };

  const acceptRequest = (requestId: string) => {
    if (!user) return;
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

  const renderRequestsSection = (
    requests: PartnershipRequest[],
    actionText?: string,
    onAction?: (requestId: string) => void
  ) => {
    return (
      <PlayerList
        players={requests.map((request) => ({
          id: request.id,
          name: request.requested.firstName + " " + request.requested.lastName,
          skillLevel: request.requested.skillLevel,
        }))}
        actionText={actionText}
        onAction={onAction}
      />
    );
  };

  const renderReceivedRequests = () => {
    if (receivedRequests.length === 0) return null;

    return renderRequestsSection(receivedRequests, "Accept", acceptRequest);
  };

  const renderSentRequests = () => {
    if (sentRequests.length === 0) return null;

    return renderRequestsSection(sentRequests, "Awaiting approval");
  };

  const renderPartnersList = () => {
    return (
      <Container column>
        {availablePartners &&
        availablePartners.length === 0 &&
        sentRequests.length === 0 &&
        receivedRequests.length === 0 ? (
          <ThemedText
            textStyle={TextStyle.Body}
            style={{ color: theme.colors.muted }}
          >
            No available partners. Make sure your friends have checked in!
          </ThemedText>
        ) : (
          <Container column grow w100>
            {renderSentRequests()}
            {renderReceivedRequests()}
            {availablePartners && (
              <PlayerList
                players={availablePartners}
                actionText="Select"
                onAction={(playerId) => selectPartner(playerId)}
              />
            )}
          </Container>
        )}
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
      <Container column grow w100 gap={gap.md}>
        <Container column grow w100 spaceBetween>
          <Container column grow w100 gap={gap.md}>
            <PlayerListItem
              player={{
                id: otherPlayer.id,
                name: otherPlayer.firstName + " " + otherPlayer.lastName,
                skillLevel: otherPlayer.skillLevel,
              }}
              showBorder={false}
            />
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
      <Container column grow w100 gap={gap.md}>
        <SearchBar
          value={partnerSearch}
          onChangeText={(text) => setPartnerSearch(text)}
          placeholder="Search..."
        />
        <ScrollArea style={{ padding: 0, width: "100%" }}>
          {renderPartnersList()}
        </ScrollArea>
      </Container>
    );
  };

  const renderPartnershipSelectionSection = () => {
    return (
      <Container column grow w100>
        {isCheckedIn ? renderCheckedInSection() : renderCheckInSection()}
      </Container>
    );
  };

  const renderLoadingSection = () => {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  };

  return (
    <Container column grow w100>
      {loadingPartnershipData || sendingRequest
        ? renderLoadingSection()
        : renderPartnershipSelectionSection()}
    </Container>
  );
};
