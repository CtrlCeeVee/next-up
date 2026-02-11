import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ThemedText,
  Card,
  Button,
  ScreenContainer,
  BackChevron,
  Container,
} from "../../components";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import {
  GlobalStyles,
  padding,
  TextStyle,
  spacing,
  gap,
  roundingLarge,
  rounding,
  defaultIconSize,
  roundingFull,
  roundingMedium,
} from "../../core/styles";
import { useAuthState } from "../../features/auth/state";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { LeaguesStackParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";
import { useLeagueNightState } from "../../features/league-nights/state";
import { leagueNightsService } from "../../di/services.registry";
import { LeagueNightInstance, Match } from "../../features/league-nights/types";
import {
  LeagueDaysSummary,
  LeagueDaysComponentSize,
  LeagueInfoComponent,
  LeagueNightsComponent,
  LeagueSettingsComponent,
} from "../../features/leagues/components";
import { TabConfig, TabScreen } from "../../components/tab-screen.component";
import { HoverActionsComponent } from "../../components/hover-actions.component";
import { ActiveLeagueNightComponent } from "../../features/league-nights/components/active-league-night.component";

type LeagueDetailRouteProp = RouteProp<
  LeaguesStackParamList,
  Routes.LeagueDetail
>;
type LeagueDetailNavigationProp = NativeStackNavigationProp<
  LeaguesStackParamList,
  Routes.LeagueDetail
>;

export const LeagueDetailScreen = () => {
  const route = useRoute<LeagueDetailRouteProp>();
  const navigation = useNavigation<LeagueDetailNavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuthState();
  const fetchLeague = useLeaguesState((state) => state.fetchLeague);
  const currentLeague = useLeaguesState((state) => state.currentLeague);
  const leagueLoading = useLeaguesState((state) => state.loading);

  const isMember = useMembershipState((state) => state.isMember);
  const leaveLeague = useMembershipState((state) => state.leaveLeague);
  const joining = useMembershipState((state) => state.joining);
  const leaving = useMembershipState((state) => state.leaving);
  const membersByLeague = useMembershipState((state) => state.membersByLeague);

  const { leagueId } = route.params as { leagueId: string };

  const [leagueNights, setLeagueNights] = useState<LeagueNightInstance[]>([]);
  const [activeLeagueNight, setActiveLeagueNight] =
    useState<LeagueNightInstance | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchLeague(leagueId);
    fetchLeagueNights();
  }, [leagueId, user]);

  useEffect(() => {
    fetchMatches();
  }, [activeLeagueNight, user]);

  const fetchLeagueNights = async () => {
    const response = await leagueNightsService.getAllLeagueNights(leagueId);
    setLeagueNights(response);
    setActiveLeagueNight(
      response.find((night) => night.status === "active") || null
    );
  };

  const fetchMatches = async () => {
    if (!activeLeagueNight || !user) return;
    const response = await leagueNightsService.getMatches(
      leagueId,
      activeLeagueNight.id,
      user.id
    );
    setMatches(response);
  };

  if (leagueLoading || !currentLeague) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.Body} style={styles.loadingText}>
            Loading league...
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  const isUserMember = isMember(leagueId);

  const getNextUpActivity = () => {
    return leagueNights.find((night) => night.status === "scheduled");
  };

  const renderHeaderComponent = () => {
    const nextUpActivity = getNextUpActivity();
    return (
      <Container column centerHorizontal>
        <Container column centerHorizontal>
          <View
            style={[
              styles.leagueIcon,
              {
                backgroundColor: theme.colors.primary + "20",
                borderColor: theme.colors.primary + "40",
              },
            ]}
          >
            <Icon
              name="trophy"
              size={defaultIconSize}
              color={theme.colors.primary}
            />
          </View>

          <ThemedText textStyle={TextStyle.Header}>
            {currentLeague.name}
          </ThemedText>
        </Container>
      </Container>
    );
  };

  const getTabs = (): TabConfig[] => {
    const tabs: TabConfig[] = [
      {
        name: "Details",
        component: (
          <LeagueInfoComponent
            league={currentLeague}
            leagueNights={[
              {
                leagueId,
                day: "Monday",
                time: "10:00 AM",
                date: "2026-01-01",
                status: "scheduled",
                courtsAvailable: 4,
                courtLabels: ["Court 1", "Court 2", "Court 3", "Court 4"],
                autoAssignmentEnabled: false,
                checkedInCount: 0,
                partnershipsCount: 0,
                possibleGames: 0,
                checkins: [],
                partnerships: [],
                requests: [],
                id: "1",
              },
            ]}
          />
        ),
      },
      {
        name: "Active",
        component: (
          <ActiveLeagueNightComponent
            league={currentLeague}
            leagueNight={activeLeagueNight || undefined}
            matches={matches}
          />
        ),
        options: {
          tabBarActiveTintColor: theme.colors.accent,
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.accent,
          },
        },
      },
      {
        name: "Upcoming",
        component: (
          <LeagueNightsComponent
            leagueNights={leagueNights}
            isUserMember={isUserMember}
            leagueId={leagueId}
          />
        ),
      },
    ];

    return tabs;
  };

  return (
    <ScreenContainer>
      <TabScreen headerComponent={renderHeaderComponent()} tabs={getTabs()} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: gap.lg,
  },
  loadingText: {
    opacity: 0.7,
  },
  leagueIcon: {
    width: defaultIconSize + 20,
    height: defaultIconSize + 20,
    borderRadius: roundingFull,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nextUpActivity: {
    gap: gap.sm,
    borderRadius: roundingMedium,
  },
});
