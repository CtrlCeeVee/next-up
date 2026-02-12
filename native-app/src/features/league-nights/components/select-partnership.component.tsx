import { Container, Refresh, SearchBar } from "../../../components";
import { useTheme } from "../../../core/theme";
import {
  gap,
  padding,
  rounding,
  spacing,
  TextStyle,
} from "../../../core/styles";
import { ThemedText } from "../../../components";
import { Button } from "../../../components";
import { useLeagueNightState } from "../state";
import { useAuthState } from "../../auth/state";
import { useEffect, useMemo, useState } from "react";
import { League } from "../../leagues/types";
import { LeagueNightInstance, PartnershipRequest } from "../types";
import { PlayerList } from "./player-list.component";
import {
  PartnershipItemVariant,
  PlayerListItem,
} from "./player-list-item.component";
import { LeagueMemberIconComponent } from "../../leagues/components/league-member-icon.component";
import { BasePlayerDetails } from "../../player/types";

interface SelectPartnershipComponentProps {
  league: League;
  night: LeagueNightInstance;
}

interface PartnerListItem {
  id: string;
  player: BasePlayerDetails;
  variant: PartnershipItemVariant;
  onAction: (playerId: string) => void;
  actionBusy: boolean;
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
  const rejectingRequest = useLeagueNightState(
    (state) => state.rejectingRequest
  );
  const rejectPartnershipRequest = useLeagueNightState(
    (state) => state.rejectPartnershipRequest
  );
  const acceptingRequest = useLeagueNightState(
    (state) => state.acceptingRequest
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

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshPartnershipData();
  }, [user, league, night]);

  const refreshPartnershipData = async () => {
    if (user?.id) {
      setRefreshing(true);
      await Promise.all([
        refreshPartnershipRequests(league.id, night.id, user.id),
        refreshCheckedInPlayers(league.id, night.id),
      ]);
      setRefreshing(false);
    }
  };

  const checkedInPlayers = useLeagueNightState(
    (state) => state.checkedInPlayers
  );

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

  const renderRequestsSection = (
    requests: PartnershipRequest[],
    onAction?: (requestId: string) => void
  ) => {
    return (
      <PlayerList
        variant={PartnershipItemVariant.RECEIVED_REQUEST}
        players={requests.map((request) => ({
          id: request.id,
          firstName: request.requested.firstName,
          lastName: request.requested.lastName,
          skillLevel: request.requested.skillLevel,
        }))}
        onAction={onAction}
      />
    );
  };

  const renderReceivedRequests = () => {
    if (receivedRequests.length === 0) return null;

    return renderRequestsSection(receivedRequests, acceptRequest);
  };

  const renderSentRequests = () => {
    if (sentRequests.length === 0) return null;

    return renderRequestsSection(sentRequests, cancelRequest);
  };

  const renderConfirmedPartnershipSection = () => {
    if (!confirmedPartnership || !user) return null;

    const otherPlayer =
      confirmedPartnership.player1Id === user.id
        ? confirmedPartnership.player2
        : confirmedPartnership.player1;

    return (
      <Container column grow w100 gap={gap.md}>
        <Container column grow w100>
          <Container
            column
            centerHorizontal
            w100
            gap={gap.md}
            padding={padding}
            rounding={rounding}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.primary + "08",
            }}
          >
            <ThemedText textStyle={TextStyle.BodyMedium} muted>
              You're partnered with
            </ThemedText>
            {/* TODO: Add player icon */}
            <LeagueMemberIconComponent
              iconUrl={undefined}
              name={otherPlayer.firstName + " " + otherPlayer.lastName}
              size={40}
            />
            <Container column w100 gap={0} centerHorizontal>
              <ThemedText textStyle={TextStyle.BodyMedium}>
                {otherPlayer.firstName} {otherPlayer.lastName}
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodyMedium} muted>
                {otherPlayer.skillLevel}
              </ThemedText>
            </Container>
          </Container>
          <ThemedText textStyle={TextStyle.BodyMedium} muted center>
            Make sure to check the matches you are playing together. You can
            change your partner at any time.
          </ThemedText>
          <Button
            text="Change partner"
            style={{ width: "100%", marginTop: spacing.lg }}
            onPress={() => {
              if (!user) return;
              removePartnership(league.id, night.id, user.id);
            }}
          />
        </Container>
      </Container>
    );
  };

  const combinePartners = (): PartnerListItem[] => {
    const partners: PartnerListItem[] = [];

    for (const request of receivedRequests) {
      partners.push({
        id: request.requester.id,
        player: {
          id: request.requester.id,
          firstName: request.requester.firstName,
          lastName: request.requester.lastName,
          skillLevel: request.requester.skillLevel,
        },
        variant: PartnershipItemVariant.RECEIVED_REQUEST,
        onAction: () => acceptRequest(request.id),
        actionBusy: acceptingRequest === request.id,
      });
    }

    for (const player of availablePartners || []) {
      partners.push({
        id: player.id,
        player: {
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          skillLevel: player.skillLevel,
        },
        variant: PartnershipItemVariant.AVAILABLE_PARTNER,
        onAction: (playerId) => selectPartner(playerId),
        actionBusy: sendingRequest === player.id,
      });
    }

    for (const request of sentRequests) {
      partners.push({
        id: request.requested.id,
        player: {
          id: request.requested.id,
          firstName: request.requested.firstName,
          lastName: request.requested.lastName,
          skillLevel: request.requested.skillLevel,
        },
        variant: PartnershipItemVariant.SENT_REQUEST,
        onAction: (playerId) => cancelRequest(request.id),
        actionBusy: rejectingRequest === request.id,
      });
    }

    return partners;
  };

  const renderPartnershipSection = () => {
    if (confirmedPartnership) {
      return renderConfirmedPartnershipSection();
    }

    return (
      <Container column grow w100 gap={0}>
        <SearchBar
          value={partnerSearch}
          onChangeText={(text) => setPartnerSearch(text)}
          placeholder="Search..."
        />
        <Refresh
          data={combinePartners()}
          renderItem={({ item }) => (
            <PlayerListItem
              variant={item.variant}
              player={item.player}
              onAction={() => item.onAction(item.player.id)}
              actionBusy={item.actionBusy}
            />
          )}
          keyExtractor={(item) => item.player.id}
          refreshing={refreshing}
          onRefresh={refreshPartnershipData}
        />
      </Container>
    );
  };

  return (
    <Container column grow w100>
      {renderPartnershipSection()}
    </Container>
  );
};
