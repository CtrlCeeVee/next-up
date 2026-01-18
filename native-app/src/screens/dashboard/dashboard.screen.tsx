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
import { GlobalStyles, padding, TextStyle } from "../../core/styles";
import { useAuthState } from "../../features/auth/state";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { AppTabParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";
import type { League } from "../../features/leagues/types";

type NavigationProp = NativeStackNavigationProp<AppTabParamList>;

interface LeagueWithNight extends League {
  hasNightToday?: boolean;
}

export const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuthState();
  const {membersByLeague, fetchMembersByLeagueId} = useMembershipState();
  const { leagues, fetchLeagues, loading: leaguesLoading } = useLeaguesState();

  const [myLeagues, setMyLeagues] = useState<LeagueWithNight[]>([]);
  const [activeTonight, setActiveTonight] = useState<LeagueWithNight | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract first name from user metadata
  const firstName = user?.user_metadata?.first_name || "there";

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch all leagues
        await fetchLeagues();

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    leagues.forEach(league => {
      fetchMembersByLeagueId(league.id);
    });
  }, [user, leagues]);

  // Filter and process user's leagues
  useEffect(() => {
    if (!leagues || !user) return;

    const userLeagues = leagues
      .filter((league) => membersByLeague[league.id]?.some(member => member.id === user.id))
      .map((league) => {
        // Check if league has a night happening today
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        const hasNightToday = league.leagueDays?.includes(today) ?? false;

        return {
          ...league,
          hasNightToday,
        };
      });

    setMyLeagues(userLeagues);

    // Find active league night for tonight (if any)
    const todayLeague = userLeagues.find((league) => league.hasNightToday);
    setActiveTonight(todayLeague || null);
  }, [leagues, membersByLeague]);

  // Quick action buttons
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
      onPress: () => navigation.navigate(Routes.Leagues, { screen: Routes.BrowseLeagues }),
    },
    {
      icon: "search" as const,
      label: "Browse",
      gradient: ["#3b82f6", "#2563eb"],
      onPress: () => navigation.navigate(Routes.Leagues, { screen: Routes.BrowseLeagues }),
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
              <ThemedText textStyle={TextStyle.BodySmall} style={styles.quickActionLabel}>
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
          ) : activeTonight ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="zap" size={20} color={theme.colors.primary} />
                <ThemedText textStyle={TextStyle.Subheader}>Happening Today</ThemedText>
              </View>
              <Card
                style={styles.activeCard}
              >
                <View
                  style={styles.activeCardGradient}
                />
                <View style={styles.activeCardContent}>
                  <ThemedText
                    textStyle={TextStyle.Header}
                    style={[styles.activeCardTitle, { color: theme.colors.primary }]}
                  >
                    {activeTonight.name}
                  </ThemedText>
                  <View style={styles.activeCardBadges}>
                    <View
                      style={styles.badge}
                    >
                      <Icon name="zap" size={12} color={theme.colors.primary} />
                      <ThemedText
                        textStyle={TextStyle.BodySmall}
                        style={[styles.badgeText, { color: theme.colors.primary }]}
                      >
                        Today
                      </ThemedText>
                    </View>
                    <View style={styles.badge}>
                      <Icon name="clock" size={12} color={theme.colors.text} />
                      <ThemedText textStyle={TextStyle.BodySmall} style={styles.badgeText}>
                        {activeTonight.startTime}
                      </ThemedText>
                    </View>
                    <View style={styles.badge}>
                      <Icon name="users" size={12} color={theme.colors.text} />
                      <ThemedText textStyle={TextStyle.BodySmall} style={styles.badgeText}>
                        {activeTonight.totalPlayers}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.locationRow}>
                    <Icon name="map-pin" size={16} color={theme.colors.text + "80"} />
                    <ThemedText textStyle={TextStyle.Body} style={styles.locationText}>
                      {activeTonight.location}
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.viewDetailsButton,
                      { backgroundColor: theme.colors.primary },
                    ]}
                    onPress={() => {
                      // Navigate to league detail
                    }}
                    activeOpacity={0.8}
                  >
                    <ThemedText textStyle={TextStyle.Button} style={styles.viewDetailsText}>
                      View Details
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="calendar" size={20} color={theme.colors.text + "60"} />
                <ThemedText textStyle={TextStyle.Body}>Next Up</ThemedText>
              </View>
              <Card style={styles.emptyCard}>
                <ThemedText textStyle={TextStyle.Body} style={styles.emptyCardText}>
                  No games scheduled for today
                </ThemedText>
                  <ThemedText textStyle={TextStyle.BodySmall} style={styles.emptyCardSubtext}>
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
                <ThemedText textStyle={TextStyle.Body}>Your Leagues</ThemedText>
              </View>
              {myLeagues.length > 0 && (
                <TouchableOpacity onPress={() => navigation.navigate(Routes.Leagues, { screen: Routes.BrowseLeagues })}>
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
                      // Navigate to league detail
                    }}
                    activeOpacity={0.7}
                  >
                    <Card
                      style={styles.leagueCardInner}
                    >
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
                              <View
                                key={day}
                                style={[
                                  styles.dayBadge,
                                  { backgroundColor: theme.colors.text + "10" },
                                ]}
                              >
                                <Icon
                                  name="calendar"
                                  size={14}
                                  color={theme.colors.primary}
                                />
                                <ThemedText
                                  textStyle={TextStyle.BodySmall}
                                  style={styles.dayBadgeText}
                                >
                                  {day}s {league.startTime}
                                </ThemedText>
                              </View>
                            ))}
                          </View>
                        </View>
                        <Icon name="trophy" size={28} color={theme.colors.primary} />
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}

                {/* Join More Leagues Card */}
                <TouchableOpacity
                  style={styles.joinMoreCard}
                  onPress={() => navigation.navigate(Routes.Leagues, { screen: Routes.BrowseLeagues })}
                  activeOpacity={0.7}
                >
                  <Card
                    style={styles.joinMoreCardInner}
                  >
                    <Icon name="plus" size={32} color={theme.colors.text + "40"} />
                    <ThemedText textStyle={TextStyle.Body} style={styles.joinMoreText}>
                      Browse More Leagues
                    </ThemedText>
                  </Card>
                </TouchableOpacity>
              </View>
            ) : (
              <Card style={styles.emptyLeaguesCard}>
                <Icon name="zap" size={28} color={theme.colors.text + "40"} />
                <ThemedText textStyle={TextStyle.BodyMedium} style={styles.emptyLeaguesText}>
                  You haven't joined any leagues yet
                </ThemedText>
                <TouchableOpacity
                  style={[
                    styles.browseButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => navigation.navigate(Routes.Leagues, { screen: Routes.BrowseLeagues })}
                  activeOpacity={0.8}
                >
                  <ThemedText textStyle={TextStyle.Button} style={styles.browseButtonText}>
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
    paddingBottom: padding * 4,
  },
  greeting: {
    marginBottom: 24,
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
    marginBottom: 32,
  },
  quickAction: {
    alignItems: "center",
    gap: 8,
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
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    overflow: "hidden",
  },
  activeCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  activeCardContent: {
    gap: 12,
  },
  activeCardTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  activeCardBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontWeight: "600",
    fontSize: 11,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    opacity: 0.7,
  },
  viewDetailsButton: {
    paddingVertical: 12,
    borderRadius: 12,
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
    gap: 8,
  },
  emptyCardText: {
    textAlign: "center",
  },
  emptyCardSubtext: {
    textAlign: "center",
  },
  loadingList: {
    gap: 12,
  },
  leaguesList: {
    gap: 12,
  },
  leagueCard: {},
  leagueCardInner: {
    ...GlobalStyles.container,
  },
  leagueCardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  leagueCardLeft: {
    flex: 1,
    gap: 8,
  },
  leagueCardTitle: {
    fontWeight: "600",
  },
  leagueCardLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  leagueCardLocationText: {
    opacity: 0.7,
    flex: 1,
  },
  leagueCardDays: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  dayBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  dayBadgeText: {
    fontWeight: "500",
  },
  joinMoreCard: {},
  joinMoreCardInner: {
    ...GlobalStyles.container,
    alignItems: "center",
    gap: 12,
  },
  joinMoreText: {
    fontWeight: "600",
    opacity: 0.7,
  },
  emptyLeaguesCard: {
    ...GlobalStyles.container,
    alignItems: "center",
    gap: 16,
  },
  emptyLeaguesText: {
    textAlign: "center",
    opacity: 0.7,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
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
