import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, FlatList } from "react-native";

import { ThemedText, Container } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { gap, padding, TextStyle } from "../../../core/styles";
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
}

export const MatchesList: React.FC<MatchesQueueTabProps> = ({
  league,
  leagueNight,
}) => {
  const { theme } = useTheme();
  const { user } = useAuthState();

  const [matches, setMatches] = useState<GetMatchResponse[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileData>>({});

  const leagueNightsService = getService<LeagueNightsService>(
    InjectableType.LEAGUE_NIGHTS
  );

  const websocketsService = getService<WebsocketsService>(
    InjectableType.WEBSOCKETS
  );

  const onMatchUpdated = useCallback(
    (match: Match, deleted: boolean = false) => {
      if (deleted) {
        setMatches((prev) => prev.filter((m) => m.match.id !== match.id));
        return;
      }
      setMatches((prev) =>
        prev.map((m) => (m.match.id === match.id ? { ...m, match } : m))
      );
    },
    []
  );

  useEffect(() => {
    return websocketsService.subscribe(
      NativeRealtimeEventName.MATCH,
      (match) => {
        console.log("match update", match, "for user", user?.id);
        onMatchUpdated(
          match.payload,
          match.type === NativeRealtimeMessageType.DELETE
        );
      }
    );
  }, [websocketsService, onMatchUpdated]);

  const fetchMatches = async () => {
    if (!leagueNight || !user) return;
    const response = await leagueNightsService.getMatches(
      league.id,
      leagueNight.id,
      user.id
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
  };

  useEffect(() => {
    fetchMatches();
  }, [leagueNight, user]);

  const matchesList: MatchItemProps[] = useMemo(() => {
    if (!leagueNight || !user) return [];

    return matches.map((match) => ({
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
    }));
  }, [matches, league, leagueNight, profiles]);

  // Separate active and completed matches
  const activeMatches = useMemo(
    () => matchesList.filter((m) => m.match.match.status === "active"),
    [matchesList]
  );
  const completedMatches = useMemo(
    () => matchesList.filter((m) => m.match.match.status === "completed"),
    [matchesList]
  );

  if (matches.length === 0) {
    return (
      <Container column gap={gap.md} centerHorizontal centerVertical w100 grow>
        <Icon name="trophy" size={48} color={theme.colors.muted} />
        <ThemedText textStyle={TextStyle.Subheader} style={styles.emptyTitle}>
          No Matches
        </ThemedText>
      </Container>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Container column gap={gap.md} w100 grow>
        {activeMatches.length > 0 && (
          <Container column gap={gap.md} w100>
            <Container row gap={gap.sm} w100 centerVertical>
              <Icon name="trophy" size={20} color={theme.colors.primary} />
              <ThemedText textStyle={TextStyle.Subheader}>
                Active Matches
              </ThemedText>
            </Container>
            <FlatList
              style={styles.container}
              data={activeMatches}
              renderItem={({ item }) => (
                <MatchItem {...item} onMatchUpdated={onMatchUpdated} />
              )}
              keyExtractor={(item) => item.match.match.id}
              scrollEnabled={false}
            />
          </Container>
        )}

        {completedMatches.length > 0 && (
          <Container column gap={gap.md} w100>
            <Container row gap={gap.sm} w100 centerVertical>
              <Icon
                name="check-circle"
                size={20}
                color={theme.colors.success}
              />
              <ThemedText textStyle={TextStyle.Subheader}>
                Completed Matches
              </ThemedText>
            </Container>
            <FlatList
              style={styles.container}
              data={completedMatches}
              renderItem={({ item }) => (
                <MatchItem {...item} onMatchUpdated={onMatchUpdated} />
              )}
              keyExtractor={(item) => item.match.match.id}
              scrollEnabled={false}
            />
          </Container>
        )}
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  content: {
    width: "100%",
    padding: padding,
    gap: 24,
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
