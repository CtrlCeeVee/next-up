import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ThemedText,
  Card,
  ScreenContainer,
  Container,
  ShimmerComponent,
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
  roundingFull,
} from "../../core/styles";
import { useAuthState } from "../../features/auth/state";
import { AppTabParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";
import type { League } from "../../features/leagues/types";
import { BadgeComponent } from "../../components/badge.component";
import { LeagueNightInstance } from "../../features/league-nights/types";
import { getService, InjectableType } from "../../di";
import { LeaguesService } from "../../features/leagues/services";
import { LeagueNightsService } from "../../features/league-nights/services";
import { DateUtility } from "../../core/utilities";
import {
  LeagueNightsComponent,
  MyLeagues,
  WeekSummary,
  StatsSummary,
} from "../../features/leagues/components";
import { useLeaguesState } from "../../features/leagues/state";

type NavigationProp = NativeStackNavigationProp<AppTabParamList>;

export const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuthState();
  const [leagues, setLeagues] = useState<League[]>([]);

  const favouriteLeagueIds = useLeaguesState(
    (state) => state.favouriteLeagueIds
  );
  const fetchFavouriteLeagueIds = useLeaguesState(
    (state) => state.fetchFavouriteLeagueIds
  );

  const [myLeagues, setMyLeagues] = useState<League[]>([]);
  const [nextUpLeagueNightInstances, setNextUpLeagueNightInstances] = useState<
    LeagueNightInstance[]
  >([]);
  const [weekLeagueNightInstances, setWeekLeagueNightInstances] = useState<
    LeagueNightInstance[]
  >([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.user_metadata?.first_name || "there";

  const leaguesService = getService<LeaguesService>(InjectableType.LEAGUES);
  const leagueNightsService = getService<LeagueNightsService>(
    InjectableType.LEAGUE_NIGHTS
  );

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch all leagues
        const leagues = await leaguesService.getAll();
        setLeagues(leagues);

        // Fetch my leagues
        const myLeagues = await leaguesService.getMyLeagues(user.id);
        setMyLeagues(myLeagues);

        // Fetch favourite league ids
        await fetchFavouriteLeagueIds(user.id);

        const nextUpLeagueNightInstances =
          await leagueNightsService.getNextUpLeagueNightInstances(3, user.id);
        setNextUpLeagueNightInstances(nextUpLeagueNightInstances);

        // Fetch week league night instances
        const weekStart = DateUtility.getCurrentWeekStart();
        const weekEnd = DateUtility.getCurrentWeekEnd();
        const weekStartStr = DateUtility.formatDateString(weekStart);
        const weekEndStr = DateUtility.formatDateString(weekEnd);
        const weekInstances =
          await leagueNightsService.getWeekLeagueNightInstances(
            user.id,
            weekStartStr,
            weekEndStr
          );
        setWeekLeagueNightInstances(weekInstances);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const getLeagueForLeagueNightInstance = (
    leagueNightInstance: LeagueNightInstance
  ) => {
    return leagues.find((league) => league.id === leagueNightInstance.leagueId);
  };

  const quickActions = [
    {
      icon: "moon" as const,
      label: "Tonight",
      gradient: ["#a855f7", "#9333ea"],
      onPress: () => navigation.navigate(Routes.Home),
    },
    {
      icon: "trophy" as const,
      label: "My Leagues",
      gradient: [theme.colors.primary],
      onPress: () =>
        navigation.navigate(Routes.Leagues, { screen: Routes.BrowseLeagues }),
    },
    {
      icon: "search" as const,
      label: "Browse",
      gradient: ["#3b82f6", "#2563eb"],
      onPress: () =>
        navigation.navigate(Routes.Leagues, { screen: Routes.BrowseLeagues }),
    },
    {
      icon: "bar-chart" as const,
      label: "Stats",
      gradient: ["#f97316", "#ea580c"],
      onPress: () => navigation.navigate(Routes.Stats),
    },
  ];

  const navigateToLeague = (leagueId: string) => {
    navigation.navigate(Routes.Leagues, {
      screen: Routes.LeagueDetail,
      params: { leagueId },
    });
  };

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Container w100 column style={{ paddingBottom: 100 }}>
          {/* Greeting */}
          <Container column w100 gap={gap.xl} padding={padding}>
            <Container column w100 gap={0}>
              <ThemedText
                textStyle={TextStyle.Header}
                style={styles.greetingText}
              >
                Hey{" "}
                <ThemedText
                  textStyle={TextStyle.Header}
                  style={[styles.greetingName, { color: theme.colors.primary }]}
                >
                  {firstName}
                </ThemedText>
              </ThemedText>
              <ThemedText
                textStyle={TextStyle.Body}
                style={styles.greetingText}
              >
                Ready to play?
              </ThemedText>
            </Container>

            <Container row spaceBetween w100 gap={gap.sm}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickAction}
                  onPress={action.onPress}
                  activeOpacity={0.7}
                >
                  <Container column centerHorizontal gap={gap.sm}>
                    <View
                      style={[
                        styles.quickActionIcon,
                        { backgroundColor: action.gradient[0] },
                      ]}
                    >
                      <Icon name={action.icon} size={28} color="#FFFFFF" />
                    </View>
                    <ThemedText
                      textStyle={TextStyle.BodySmall}
                      style={styles.quickActionLabel}
                    >
                      {action.label}
                    </ThemedText>
                  </Container>
                </TouchableOpacity>
              ))}
            </Container>
          </Container>

          {/* Quick Actions */}

          {/* Content Sections */}
          <Container
            column
            w100
            gap={gap.xl}
            style={{
              flex: 1,
            }}
          >
            {/* Happening Today Section */}

            <Container column w100 gap={gap.sm} style={{ padding: padding }}>
              <Container row spaceBetween w100>
                <View style={styles.sectionHeader}>
                  <ThemedText textStyle={TextStyle.Body}>My Leagues</ThemedText>
                </View>
                {myLeagues.length > 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(Routes.Leagues, {
                        screen: Routes.BrowseLeagues,
                      })
                    }
                  >
                    <Container row centerVertical gap={gap.xs}>
                      <ThemedText
                        textStyle={TextStyle.Body}
                        style={[
                          styles.seeAllText,
                          { color: theme.colors.primary },
                        ]}
                      >
                        All
                      </ThemedText>
                      <Icon
                        name="chevron-right"
                        size={16}
                        color={theme.colors.primary}
                      />
                    </Container>
                  </TouchableOpacity>
                )}
              </Container>

              {loading ? (
                <Container row gap={gap.sm} w100>
                  {[1, 2, 3].map((item, index) => (
                    <ShimmerComponent
                      key={index}
                      width={52}
                      height={52}
                      rounding={roundingFull}
                      renderCardUnderneath={true}
                    />
                  ))}
                </Container>
              ) : (
                <MyLeagues
                  leagues={myLeagues}
                  favouriteLeagueIds={favouriteLeagueIds}
                />
              )}
            </Container>

            <Container column w100 gap={gap.md}>
              <ThemedText
                textStyle={TextStyle.Body}
                style={{ paddingLeft: padding }}
              >
                Next Up
              </ThemedText>
              {loading ? (
                <Container w100 padding={padding}>
                  <ShimmerComponent
                    width="100%"
                    height={80}
                    rounding={roundingLarge}
                    renderCardUnderneath={true}
                  />
                </Container>
              ) : (
                <LeagueNightsComponent
                  leagues={leagues}
                  showLeague={true}
                  leagueNights={nextUpLeagueNightInstances}
                  isUserMember={false}
                  onLeagueNightPress={(night) =>
                    navigateToLeague(night.leagueId)
                  }
                />
              )}
            </Container>

            {/* Stats summary */}
            <Container column w100 gap={gap.md} paddingHorizontal={padding}>
              <ThemedText textStyle={TextStyle.Body}>Statistics</ThemedText>
              <StatsSummary leagues={leagues} />
            </Container>
          </Container>
        </Container>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: gap.sm,
  },
  greetingText: {
    flexWrap: "wrap",
  },
  greetingName: {
    fontWeight: "700",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xxl,
  },
  quickAction: {
    alignItems: "center",
    gap: gap.sm,
    flex: 1,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickActionLabel: {
    fontWeight: "600",
    textAlign: "center",
  },
  sections: {
    gap: gap.xl,
  },
  section: {
    width: "100%",
    gap: gap.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAllText: {
    fontWeight: "600",
  },
  loadingCard: {
    ...GlobalStyles.container,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  activeCard: {
    ...GlobalStyles.container,
    borderWidth: 1,
    borderColor: "#34d3994d",
  },
  activeCardContent: {
    gap: gap.md,
    padding: padding,
    width: "100%",
  },
  activeCardTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  activeCardBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: gap.sm,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.xs,
  },
  locationText: {
    opacity: 0.7,
  },
  viewDetailsButton: {
    paddingVertical: spacing.md,
    borderRadius: roundingLarge,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  viewDetailsText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  emptyCard: {
    ...GlobalStyles.container,
    alignItems: "center",
    gap: gap.sm,
  },
  emptyCardText: {
    textAlign: "center",
  },
  emptyCardSubtext: {
    textAlign: "center",
  },
  loadingList: {
    gap: gap.md,
  },
  leaguesList: {
    gap: gap.md,
  },
  leagueCard: {},
  leagueCardInner: {
    ...GlobalStyles.container,
  },
  leagueCardContent: {
    padding: padding,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: gap.md,
  },
  leagueCardLeft: {
    flex: 1,
    gap: gap.sm,
  },
  leagueCardTitle: {
    fontWeight: "600",
  },
  leagueCardLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.xs,
  },
  leagueCardLocationText: {
    opacity: 0.7,
    flex: 1,
  },
  leagueCardDays: {
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: gap.sm - 2,
  },
  joinMoreCard: {},
  joinMoreCardInner: {
    ...GlobalStyles.container,
    alignItems: "center",
    justifyContent: "center",
    gap: gap.md,
  },
  joinMoreCardContent: {
    ...GlobalStyles.container,
    alignItems: "center",
    justifyContent: "center",
    gap: gap.sm,
  },
  joinMoreText: {
    fontWeight: "600",
    opacity: 0.7,
  },
  emptyLeaguesCard: {
    ...GlobalStyles.container,
    alignItems: "center",
    gap: gap.lg,
  },
  emptyLeaguesText: {
    textAlign: "center",
    opacity: 0.7,
  },
  browseButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: roundingLarge,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
