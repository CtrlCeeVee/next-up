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
import { ThemedText, Card, ScreenContainer } from "../../components";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import {
  GlobalStyles,
  padding,
  TextStyle,
  spacing,
  gap,
  roundingLarge,
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

type NavigationProp = NativeStackNavigationProp<AppTabParamList>;

interface LeagueWithNight extends Omit<League, "startTime" | "totalPlayers"> {
  hasNightToday?: boolean;
  nightId?: string;
  startTime?: string;
  totalPlayers?: number;
}

export const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuthState();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [myLeagues, setMyLeagues] = useState<League[]>([]);
  const [nextUpLeagueNightInstances, setNextUpLeagueNightInstances] = useState<
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
        const myLeagues = await leaguesService.getMyLeagues(user.id);
        setMyLeagues(myLeagues);
        const nextUpLeagueNightInstances =
          await leagueNightsService.getNextUpLeagueNightInstances(3, user.id);
        setNextUpLeagueNightInstances(nextUpLeagueNightInstances);
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
      icon: "zap" as const,
      label: "Tonight",
      gradient: [theme.colors.primary],
      onPress: () => navigation.navigate(Routes.Home),
    },
    {
      icon: "trophy" as const,
      label: "My Leagues",
      gradient: ["#a855f7", "#9333ea"],
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

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <ThemedText textStyle={TextStyle.Header} style={styles.greetingText}>
            Hey{" "}
            <ThemedText
              textStyle={TextStyle.Header}
              style={[styles.greetingName, { color: theme.colors.primary }]}
            >
              {firstName}
            </ThemedText>
          </ThemedText>
          <ThemedText textStyle={TextStyle.Body} style={styles.greetingText}>
            Ready to play?
          </ThemedText>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAction}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
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
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Sections */}
        <View style={styles.sections}>
          {/* Happening Today Section */}
          {loading ? (
            <Card style={styles.loadingCard}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </Card>
          ) : nextUpLeagueNightInstances.length > 0 ? (
            <View style={{ gap: gap.md }}>
              <View style={styles.sectionHeader}>
                <Icon name="zap" size={20} color={theme.colors.primary} />
                <ThemedText textStyle={TextStyle.Subheader}>Next Up</ThemedText>
              </View>
              {nextUpLeagueNightInstances.map((leagueNightInstance) => {
                const league =
                  getLeagueForLeagueNightInstance(leagueNightInstance);
                if (!league) return null;

                return (
                  <View style={styles.section} key={leagueNightInstance.id}>
                    <Card
                      style={styles.activeCard}
                      linearGradientColors={
                        isDark
                          ? ["rgb(74 222 128 / .05)", "rgb(52 211 153 / .1)"]
                          : undefined
                      }
                    >
                      <View style={styles.activeCardContent}>
                        <ThemedText
                          textStyle={TextStyle.Header}
                          style={[
                            styles.activeCardTitle,
                            { color: theme.colors.primary },
                          ]}
                        >
                          {league.name}
                        </ThemedText>
                        <View style={styles.activeCardBadges}>
                          <BadgeComponent icon="zap" text="Today" />
                          <BadgeComponent
                            icon="clock"
                            text={league.startTime || ""}
                            color={theme.colors.text}
                          />
                          <BadgeComponent
                            icon="users"
                            text={league.totalPlayers?.toString() || ""}
                            color={theme.colors.text}
                          />
                        </View>
                        <View style={styles.locationRow}>
                          <Icon
                            name="map-pin"
                            size={16}
                            color={theme.colors.text + "80"}
                          />
                          <ThemedText
                            textStyle={TextStyle.Body}
                            style={styles.locationText}
                          >
                            {league.location}
                          </ThemedText>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.viewDetailsButton,
                            { backgroundColor: theme.colors.primary },
                          ]}
                          onPress={() => {
                            if (leagueNightInstance?.date) {
                              (navigation as any).navigate(Routes.Leagues, {
                                screen: Routes.LeagueNight,
                                params: {
                                  leagueId: leagueNightInstance.id,
                                  nightId: leagueNightInstance.date,
                                },
                              });
                            }
                          }}
                          activeOpacity={0.8}
                        >
                          <ThemedText
                            textStyle={TextStyle.Button}
                            style={styles.viewDetailsText}
                          >
                            View Details
                          </ThemedText>
                        </TouchableOpacity>
                      </View>
                    </Card>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon
                  name="calendar"
                  size={20}
                  color={theme.colors.text + "60"}
                />
                <ThemedText textStyle={TextStyle.Body}>Next Up</ThemedText>
              </View>
              <Card style={styles.emptyCard}>
                <ThemedText
                  textStyle={TextStyle.Body}
                  style={styles.emptyCardText}
                >
                  No games scheduled for today
                </ThemedText>
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.emptyCardSubtext}
                >
                  Check your leagues below for upcoming games
                </ThemedText>
              </Card>
            </View>
          )}

          {/* Your Leagues Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeader}>
                <Icon name="trophy" size={20} color={theme.colors.primary} />
                <ThemedText textStyle={TextStyle.Subheader}>
                  Your Leagues
                </ThemedText>
              </View>
              {myLeagues.length > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(Routes.Leagues, {
                      screen: Routes.BrowseLeagues,
                    })
                  }
                >
                  <ThemedText
                    textStyle={TextStyle.BodySmall}
                    style={[styles.seeAllText, { color: theme.colors.primary }]}
                  >
                    See all →
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            {loading ? (
              <View style={styles.loadingList}>
                {[1, 2].map((i) => (
                  <Card key={i} style={styles.loadingCard}>
                    <ActivityIndicator color={theme.colors.primary} />
                  </Card>
                ))}
              </View>
            ) : myLeagues.length > 0 ? (
              <View style={styles.leaguesList}>
                {myLeagues.map((league) => (
                  <TouchableOpacity
                    key={league.id}
                    style={styles.leagueCard}
                    onPress={() => {
                      navigation.navigate(Routes.Leagues, {
                        screen: Routes.LeagueDetail,
                        params: {
                          leagueId: league.id,
                        },
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <Card style={styles.leagueCardInner}>
                      <View style={styles.leagueCardContent}>
                        <View style={styles.leagueCardLeft}>
                          <ThemedText
                            textStyle={TextStyle.Body}
                            style={styles.leagueCardTitle}
                          >
                            {league.name}
                          </ThemedText>
                          <View style={styles.leagueCardLocation}>
                            <Icon
                              name="map-pin"
                              size={14}
                              color={theme.colors.text + "60"}
                            />
                            <ThemedText
                              textStyle={TextStyle.BodySmall}
                              style={styles.leagueCardLocationText}
                            >
                              {league.location}
                            </ThemedText>
                          </View>
                          <View style={styles.leagueCardDays}>
                            {league.leagueDays?.map((day) => (
                              <BadgeComponent
                                key={day}
                                icon="calendar"
                                text={day + "s " + league.startTime}
                                color={theme.colors.text}
                              />
                            ))}
                          </View>
                        </View>
                        <Icon
                          name="trophy"
                          size={28}
                          color={theme.colors.primary}
                        />
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}

                {/* Join More Leagues Card */}
                <TouchableOpacity
                  style={styles.joinMoreCard}
                  onPress={() =>
                    navigation.navigate(Routes.Leagues, {
                      screen: Routes.BrowseLeagues,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Card style={styles.joinMoreCardInner}>
                    <View style={styles.joinMoreCardContent}>
                      <Icon
                        name="plus"
                        size={32}
                        color={theme.colors.text + "40"}
                      />
                      <ThemedText
                        textStyle={TextStyle.Body}
                        style={styles.joinMoreText}
                      >
                        Browse More Leagues
                      </ThemedText>
                    </View>
                  </Card>
                </TouchableOpacity>
              </View>
            ) : (
              <Card style={styles.emptyLeaguesCard}>
                <Icon name="zap" size={28} color={theme.colors.text + "40"} />
                <ThemedText
                  textStyle={TextStyle.BodyMedium}
                  style={styles.emptyLeaguesText}
                >
                  You haven't joined any leagues yet
                </ThemedText>
                <TouchableOpacity
                  style={[
                    styles.browseButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() =>
                    navigation.navigate(Routes.Leagues, {
                      screen: Routes.BrowseLeagues,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <ThemedText
                    textStyle={TextStyle.Button}
                    style={styles.browseButtonText}
                  >
                    Browse Leagues
                  </ThemedText>
                </TouchableOpacity>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: padding,
    paddingBottom: spacing.xxxl + spacing.lg,
  },
  greeting: {
    marginBottom: spacing.xl,
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
    width: 64,
    height: 64,
    borderRadius: 32,
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
