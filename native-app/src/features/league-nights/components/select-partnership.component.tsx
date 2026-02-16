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
import { getService, InjectableType, leagueNightsService } from "../../../di";
import { GetCheckedInPlayerResponse } from "../services/responses";
import { WebsocketsService } from "../../websockets/services/websockets.service";
import {
  NativeRealtimeEventName,
  NativeRealtimeMessageType,
} from "../../websockets/types/websockets.types";
import { ProfileData } from "../../profiles/types";

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
  profile: ProfileData;
  player: BasePlayerDetails;
  variant: PartnershipItemVariant;
  onAction: (playerId: string) => void;
  actionBusy: boolean;
}

interface ConfirmedPartnershipListItem {
  id: string;
  confirmedPartnership: ConfirmedPartnership;
  profile?: ProfileData;
  otherPlayer?: ProfileData;
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
    useState<ConfirmedPartnershipListItem | null>(null);
  const [checkedInPlayersResponse, setCheckedInPlayersResponse] = useState<
    GetCheckedInPlayerResponse[]
  >([]);
  const websocketsService = getService<WebsocketsService>(
    InjectableType.WEBSOCKETS
  );
  const [profileMap, setProfileMap] = useState<Record<string, ProfileData>>({});

  const upsertPartnershipRequest = async (
    partnershipRequest: PartnershipRequest,
    deleted: boolean
  ) => {
    if (!user) return;

    if (deleted) {
      setSentRequests(
        sentRequests.filter((request) => request.id !== partnershipRequest.id)
      );
      setReceivedRequests(
        receivedRequests.filter(
          (request) => request.id !== partnershipRequest.id
        )
      );
      return;
    }

    if (partnershipRequest.requester.id === user.id) {
      const newSentRequests = sentRequests.filter(
        (request) => request.id !== partnershipRequest.id
      );
      if (partnershipRequest.status === "pending" && !deleted) {
        newSentRequests.push(partnershipRequest);
      }
      setSentRequests(newSentRequests);
    } else if (partnershipRequest.requested.id === user.id) {
      const newReceivedRequests = receivedRequests.filter(
        (request) => request.id !== partnershipRequest.id
      );
      if (partnershipRequest.status === "pending" && !deleted) {
        newReceivedRequests.push(partnershipRequest);
      }
      setReceivedRequests(newReceivedRequests);
    }
  };

  useEffect(() => {
    return websocketsService.subscribe(
      NativeRealtimeEventName.PARTNERSHIP_REQUEST,
      (message) => {
        upsertPartnershipRequest(
          message.payload,
          message.type === NativeRealtimeMessageType.DELETE
        );
      }
    );
  }, []);

  const upsertConfirmedPartnership = (
    confirmedPartnership: ConfirmedPartnership,
    deleted: boolean
  ) => {
    if (deleted || !confirmedPartnership.isActive) {
      setConfirmedPartnership(null);
    } else {
      console.log(profileMap);
      setConfirmedPartnership({
        id: confirmedPartnership.id,
        confirmedPartnership: confirmedPartnership,
        profile: profileMap[confirmedPartnership.player1Id],
        otherPlayer: profileMap[confirmedPartnership.player2Id],
      });
    }
  };

  useEffect(() => {
    return websocketsService.subscribe(
      NativeRealtimeEventName.CONFIRMED_PARTNERSHIP,
      (message) => {
        upsertConfirmedPartnership(
          message.payload,
          message.type === NativeRealtimeMessageType.DELETE
        );
      }
    );
  }, []);

  const fetchPartnershipRequests = async () => {
    if (!user) return;
    const response = await leagueNightsService.getPartnershipRequests(
      league.id,
      night.id,
      user.id
    );
    setSentRequests(response.sentRequests);
    setReceivedRequests(response.receivedRequests);
    const checkedInPlayers = await leagueNightsService.getCheckedInPlayers(
      league.id,
      night.id
    );
    const profileMap = checkedInPlayers.checkins.reduce(
      (acc, checkin) => {
        acc[checkin.profile.id] = checkin.profile;
        return acc;
      },
      {} as Record<string, ProfileData>
    );
    const confirmedPartnership = response.confirmedPartnership
      ? {
          id: response.confirmedPartnership.id,
          confirmedPartnership: response.confirmedPartnership,
          profile: profileMap[response.confirmedPartnership.player1Id],
          otherPlayer: profileMap[response.confirmedPartnership.player2Id],
        }
      : null;
    setConfirmedPartnership(confirmedPartnership);
    setProfileMap(profileMap);
    setCheckedInPlayersResponse(checkedInPlayers.checkins);
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
  }, [
    checkedInPlayersResponse,
    user,
    sentRequests,
    receivedRequests,
    partnerSearch,
  ]);

  const combinedPartners = useMemo(() => {
    const partners: PartnerListItem[] = [];

    for (const request of receivedRequests) {
      partners.push({
        id: request.requester.id,
        profile: profileMap[request.requester.id],
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
        profile: player.profile,
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
        profile: profileMap[request.requested.id],
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
  }, [
    checkedInPlayersResponse,
    user,
    sentRequests,
    receivedRequests,
    partnerSearch,
    profileMap,
    acceptingRequest,
    rejectingRequest,
    sendingRequest,
    removingPartnership,
  ]);

  const filteredPartners = useMemo(() => {
    return combinedPartners.filter((partner) => {
      return (
        partner.player.firstName
          .toLowerCase()
          .includes(partnerSearch.toLowerCase()) ||
        partner.player.lastName
          .toLowerCase()
          .includes(partnerSearch.toLowerCase()) ||
        partner.player.skillLevel
          .toLowerCase()
          .includes(partnerSearch.toLowerCase())
      );
    });
  }, [combinedPartners, partnerSearch]);

  useEffect(() => {
    fetchPartnershipRequests();
  }, [user]);

  const selectPartner = async (playerId: string) => {
    if (!user) return;
    try {
      setSendingRequest(playerId);
      const partnershipRequest =
        await leagueNightsService.sendPartnershipRequest(
          league.id,
          night.id,
          user.id,
          playerId
        );
      upsertPartnershipRequest(partnershipRequest, false);
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
      const partnership = await leagueNightsService.acceptPartnershipRequest(
        league.id,
        night.id,
        requestId,
        user.id
      );
      upsertConfirmedPartnership(partnership, false);
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
      setConfirmedPartnership(null);
      fetchPartnershipRequests();
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingPartnership(null);
    }
  };

  const renderConfirmedPartnershipSection = () => {
    if (!confirmedPartnership || !user) return null;

    if (!confirmedPartnership.profile || !confirmedPartnership.otherPlayer) {
      return (
        <Container column grow w100 gap={gap.md}>
          <ThemedText textStyle={TextStyle.BodyMedium} muted>
            You're are partnered but there was an error loading your partner's
            details. Please refresh the page and try again.
          </ThemedText>
        </Container>
      );
    }

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
              name={
                confirmedPartnership.otherPlayer.firstName +
                " " +
                confirmedPartnership.otherPlayer.lastName
              }
              size={40}
            />
            <Container column w100 gap={0} centerHorizontal>
              <ThemedText textStyle={TextStyle.BodyMedium}>
                {confirmedPartnership.otherPlayer.firstName}{" "}
                {confirmedPartnership.otherPlayer.lastName}
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodyMedium} muted>
                {confirmedPartnership.otherPlayer.skillLevel}
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
            loading={removingPartnership === user.id}
          />
        </Container>
      </Container>
    );
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
        <Container column grow w100 padding={padding}>
          <Refresh
            data={filteredPartners}
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
            ListEmptyComponent={
              <ThemedText textStyle={TextStyle.Body} muted>
                No partners found
              </ThemedText>
            }
          />
        </Container>
      </Container>
    );
  };

  return (
    <Container column grow w100>
      {renderPartnershipSection()}
    </Container>
  );
};
