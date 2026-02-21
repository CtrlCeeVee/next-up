import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, FlatList } from "react-native";

import {
  ThemedText,
  Container,
  Refresh,
  Button,
  Dropdown,
} from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { gap, padding, paddingSmall, TextStyle } from "../../../core/styles";
import { MatchItem, MatchItemProps } from "./match-item.component";
import {
  GetMatchResponse,
  LeagueNightInstance,
  Match,
} from "../../league-nights/types";
import { League } from "../../leagues/types";
import { useAuthState } from "../../auth/state";
import { ProfileData } from "../../profiles/types";
import { getService } from "../../../di/di";
import { InjectableType } from "../../../di/di";
import { LeagueNightsService } from "../../league-nights/services/league-nights.service";
import { WebsocketsService } from "../../websockets/services/websockets.service";
import {
  NativeRealtimeEventName,
  NativeRealtimeMessageType,
} from "../../websockets/types";

interface MatchesQueueTabProps {
  league: League;
  leagueNight: LeagueNightInstance;
  showAdminButtons: boolean;
}

enum ShowMatches {
  MY_MATCHES = "my_matches",
  ALL_MATCHES = "all_matches",
}

export const MatchesList: React.FC<MatchesQueueTabProps> = ({
  league,
  leagueNight,
  showAdminButtons,
}) => {
  const { theme } = useTheme();
  const { user } = useAuthState();

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<GetMatchResponse[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileData>>({});

  const [showMatches, setShowMatches] = useState<ShowMatches>(
    ShowMatches.MY_MATCHES
  );

  const leagueNightsService = getService<LeagueNightsService>(
    InjectableType.LEAGUE_NIGHTS
  );

  const websocketsService = getService<WebsocketsService>(
    InjectableType.WEBSOCKETS
  );

  const onMatchUpdated = useCallback(
    async (
      match: Match,
      type: NativeRealtimeMessageType = NativeRealtimeMessageType.UPDATE
    ) => {
      if (type === NativeRealtimeMessageType.DELETE) {
        setMatches((prev) => prev.filter((m) => m.match.id !== match.id));
        return;
      }
      if (type === NativeRealtimeMessageType.INSERT) {
        const response = await leagueNightsService.getMatch(
          league.id,
          leagueNight.id,
          match.id
        );
        setMatches((prev) => [...prev, response]);
        return;
      }
      setMatches((prev) =>
        prev.map((m) => (m.match.id === match.id ? { ...m, match } : m))
      );
    },
    [league.id, leagueNight.id]
  );

  useEffect(() => {
    return websocketsService.subscribe(
      NativeRealtimeEventName.MATCH,
      (match) => {
        console.log("match update", match, "for user", user?.id);
        onMatchUpdated(match.payload, match.type);
      }
    );
  }, [websocketsService, onMatchUpdated]);

  const fetchMatches = async () => {
    if (!leagueNight || !user) return;
    setLoading(true);
    const response = await leagueNightsService.getMatches(
      league.id,
      leagueNight.id,
      showMatches === ShowMatches.MY_MATCHES ? user.id : undefined
    );
    setMatches(response.matches);
    const profilesMap = response.profiles.reduce(
      (acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      },
      {} as Record<string, ProfileData>
    );
    setProfiles(profilesMap);
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, [leagueNight, user, showMatches]);

  const renderMatchItem = useCallback(
    ({ item }: { item: MatchItemProps }) => (
      <MatchItem {...item} onMatchUpdated={onMatchUpdated} />
    ),
    [onMatchUpdated]
  );

  const keyExtractor = useCallback(
    (item: MatchItemProps) => item.match.match.id,
    []
  );

  const matchesList: MatchItemProps[] = useMemo(() => {
    if (!leagueNight || !user) return [];

    return matches
      .map((match) => ({
        leagueId: league.id,
        leagueNightId: leagueNight.id,
        match: match,
        partnership1: {
          partnership: match.partnership1,
          profile1: profiles[match.partnership1.player1Id],
          profile2: profiles[match.partnership1.player2Id],
        },
        partnership2: {
          partnership: match.partnership2,
          profile1: profiles[match.partnership2.player1Id],
          profile2: profiles[match.partnership2.player2Id],
        },
        showAdminButtons,
      }))
      .sort((a, b) =>
        a.match.match.createdAt > b.match.match.createdAt ? -1 : 1
      );
  }, [matches, league, leagueNight, profiles]);

  return (
    <Container column w100 grow padding={paddingSmall} gap={gap.md}>
      <Container row w100 endHorizontal>
        <Dropdown
          containerStyle={{ width: "100%" }}
          placeholder="Show matches..."
          value={showMatches}
          onChange={(value) => {
            setShowMatches(value as ShowMatches);
          }}
        >
          <Dropdown.Item label="My matches" value={ShowMatches.MY_MATCHES} />
          <Dropdown.Item label="All matches" value={ShowMatches.ALL_MATCHES} />
        </Dropdown>
      </Container>
      <Refresh
        data={matchesList}
        renderItem={renderMatchItem}
        keyExtractor={keyExtractor}
        refreshing={loading}
        onRefresh={fetchMatches}
        style={{ flex: 1, width: "100%" }}
        ListEmptyComponent={
          <Container
            column
            w100
            grow
            gap={gap.md}
            centerHorizontal
            centerVertical
          >
            <Icon name="trophy" size={48} color={theme.colors.muted} />
            <ThemedText
              textStyle={TextStyle.Subheader}
              style={styles.emptyTitle}
            >
              No Matches
            </ThemedText>
          </Container>
        }
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    opacity: 0.7,
    textAlign: "center",
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
