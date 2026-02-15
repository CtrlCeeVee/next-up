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
import { useAuthState } from "../../auth/state";
import { useEffect, useMemo, useState } from "react";
import { League } from "../../leagues/types";
import {
  CheckedInPlayer,
  ConfirmedPartnership,
  LeagueNightInstance,
  PartnershipRequest,
} from "../types";
import { PlayerList } from "./player-list.component";
import {
  PartnershipItemVariant,
  PlayerListItem,
} from "./player-list-item.component";
import { LeagueMemberIconComponent } from "../../leagues/components/league-member-icon.component";
import { BasePlayerDetails, Player } from "../../player/types";
import { leagueNightsService } from "../../../di";
import { GetCheckedInPlayerResponse } from "../services/responses";

export interface SelectPartnershipEffects {
  onSelectPartner: (playerId: string) => Promise<void>;
  onCancelRequest: (requestId: string) => Promise<void>;
  onAcceptRequest: (requestId: string) => Promise<void>;
  onRejectRequest: (requestId: string) => Promise<void>;
  onRemovePartnership: (playerId: string) => Promise<void>;
  onRefreshPartnershipData: () => Promise<void>;
}

export interface SelectPartnershipComponentProps {
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
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<string | null>(null);
  const [removingPartnership, setRemovingPartnership] = useState<string | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);
  const [sentRequests, setSentRequests] = useState<PartnershipRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<
    PartnershipRequest[]
  >([]);
  const [confirmedPartnership, setConfirmedPartnership] =
    useState<ConfirmedPartnership | null>(null);
  const [checkedInPlayersResponse, setCheckedInPlayersResponse] = useState<
    GetCheckedInPlayerResponse[]
  >([]);

  const fetchPartnershipRequests = async () => {
    if (!user) return;
    const response = await leagueNightsService.getPartnershipRequests(
      league.id,
      night.id,
      user.id
    );
    setSentRequests(response.sentRequests);
    setReceivedRequests(response.receivedRequests);
    setConfirmedPartnership(response.confirmedPartnership);
  };

  const fetchCheckedInPlayers = async () => {
    if (!user) return;
    const response = await leagueNightsService.getCheckedInPlayers(
      league.id,
      night.id
    );
    setCheckedInPlayersResponse(response.checkedInPlayers);
  };

  const availablePartners = useMemo(() => {
    if (!user || !sentRequests || !receivedRequests) {
      return undefined;
    }
    return checkedInPlayersResponse.filter(
      (checkedInPlayerResponse) =>
        checkedInPlayerResponse.checkin.id !== user.id &&
        !checkedInPlayerResponse.hasPartner &&
        !sentRequests.some(
          (request) =>
            request.requested.id === checkedInPlayerResponse.checkin.id
        ) &&
        !receivedRequests.some(
          (request) =>
            request.requester.id === checkedInPlayerResponse.checkin.id
        )
    );
  }, [checkedInPlayersResponse, user, sentRequests, receivedRequests]);

  useEffect(() => {
    fetchPartnershipRequests();
    fetchCheckedInPlayers();
  }, [user]);

  const selectPartner = async (playerId: string) => {
    if (!user) return;
    try {
      setSendingRequest(playerId);
      await leagueNightsService.sendPartnershipRequest(
        league.id,
        night.id,
        user.id,
        playerId
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSendingRequest(null);
    }
  };

  const cancelRequest = async (requestId: string) => {
    if (!user) return;
    try {
      setRejectingRequest(requestId);
      await leagueNightsService.rejectPartnershipRequest(
        league.id,
        night.id,
        requestId,
        user.id
      );
    } catch (error) {
      console.error(error);
    } finally {
      setRejectingRequest(null);
    }
  };

  const acceptRequest = async (requestId: string) => {
    if (!user) return;
    try {
      setAcceptingRequest(requestId);
      await leagueNightsService.acceptPartnershipRequest(
        league.id,
        night.id,
        requestId,
        user.id
      );
    } catch (error) {
      console.error(error);
    } finally {
      setAcceptingRequest(null);
    }
  };

  const removePartnership = async () => {
    if (!user) return;
    try {
      setRemovingPartnership(user.id);
      await leagueNightsService.removePartnership(league.id, night.id, user.id);
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingPartnership(null);
    }
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
              removePartnership();
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
        id: player.profile.id,
        player: {
          id: player.profile.id,
          firstName: player.profile.firstName,
          lastName: player.profile.lastName,
          skillLevel: player.profile.skillLevel,
        },
        variant: PartnershipItemVariant.AVAILABLE_PARTNER,
        onAction: (playerId) => selectPartner(playerId),
        actionBusy: sendingRequest === player.profile.id,
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
          onRefresh={fetchPartnershipRequests}
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
