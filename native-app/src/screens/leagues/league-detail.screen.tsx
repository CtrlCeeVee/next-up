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
} from "../../core/styles";
import { useAuthState } from "../../features/auth/state";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { LeaguesStackParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";
import { useLeagueNightState } from "../../features/league-nights/state";
import { leagueNightsService } from "../../di/services.registry";
import { LeagueNightInstance } from "../../features/league-nights/types";
import {
  LeagueDays,
  LeagueDaysComponentSize,
} from "../../features/leagues/components";

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
  const joinLeague = useMembershipState((state) => state.joinLeague);
  const leaveLeague = useMembershipState((state) => state.leaveLeague);
  const joining = useMembershipState((state) => state.joining);
  const leaving = useMembershipState((state) => state.leaving);
  const membersByLeague = useMembershipState((state) => state.membersByLeague);

  const { leagueId } = route.params as { leagueId: string };

  const [leagueNights, setLeagueNights] = useState<LeagueNightInstance[]>([]);

  useEffect(() => {
    fetchLeague(leagueId);
    fetchLeagueNights();
  }, [leagueId, user]);

  const fetchLeagueNights = async () => {
    const response = await leagueNightsService.getAllLeagueNights(leagueId);
    setLeagueNights(response);
  };

  const handleJoinLeave = async () => {
    if (!user) return;

    try {
      if (isMember(leagueId)) {
        await leaveLeague(leagueId, user.id);
      } else {
        await joinLeague(leagueId, user.id);
      }
    } catch (error) {
      console.error("Error joining/leaving league:", error);
    }
  };

  const handleNavigateToNight = (nightId: string) => {
    navigation.navigate(Routes.LeagueNight, {
      leagueId,
      nightId,
    });
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

  const members = membersByLeague[leagueId] || [];
  const isUserMember = isMember(leagueId);

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <BackChevron />
        {/* Hero Section with Gradient */}
        <View
          style={[
            styles.heroSection,
            { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
          ]}
        >
          {/* League Icon */}
          <View
            style={[
              styles.leagueIcon,
              {
                backgroundColor: theme.colors.primary + "20",
                borderColor: theme.colors.primary + "40",
              },
            ]}
          >
            <Icon name="trophy" size={32} color={theme.colors.primary} />
          </View>

          {/* League Name */}
          <ThemedText textStyle={TextStyle.Header} style={styles.leagueName}>
            {currentLeague.name}
          </ThemedText>

          {/* Is Active Badge */}
          {currentLeague.isActive && (
            <View
              style={[
                styles.activeBadge,
                { backgroundColor: theme.colors.success + "20" },
              ]}
            >
              <Icon
                name="check-circle"
                size={14}
                color={theme.colors.success}
              />
              <ThemedText
                textStyle={TextStyle.BodySmall}
                color={theme.colors.success}
              >
                Active
              </ThemedText>
            </View>
          )}

          {/* Quick Info */}
          {/* <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Icon name="map-pin" size={14} color={theme.colors.text + "80"} />
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.quickInfoText}
              >
                {currentLeague.location}
              </ThemedText>
            </View>
            <View style={styles.quickInfoItem}>
              <Icon
                name="calendar"
                size={14}
                color={theme.colors.text + "80"}
              />
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.quickInfoText}
              >
                {currentLeague.leagueDays.join(", ")}
              </ThemedText>
            </View>
            <View style={styles.quickInfoItem}>
              <Icon name="clock" size={14} color={theme.colors.text + "80"} />
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={styles.quickInfoText}
              >
                {currentLeague.startTime}
              </ThemedText>
            </View>
          </View> */}
        </View>

        {/* Content Section */}
        <View style={[styles.contentSection]}>
          <View style={styles.contentSectionInner}>
            <LeagueDays
              leagueDays={currentLeague.leagueDays}
              size={LeagueDaysComponentSize.Large}
            />

            {/* Stats Quick View */}
            <View style={styles.statsGrid}>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.componentBackground + "99" },
                ]}
              >
                <Icon name="users" size={20} color={theme.colors.primary} />
                <ThemedText
                  textStyle={TextStyle.Header}
                  style={styles.statValue}
                >
                  {members.length}
                </ThemedText>
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.statLabel}
                >
                  Members
                </ThemedText>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.componentBackground + "99" },
                ]}
              >
                <Icon name="trophy" size={20} color={theme.colors.success} />
                <ThemedText
                  textStyle={TextStyle.Header}
                  style={styles.statValue}
                >
                  {currentLeague.leagueDays.length}
                </ThemedText>
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.statLabel}
                >
                  Nights/Week
                </ThemedText>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.componentBackground + "99" },
                ]}
              >
                {currentLeague.isActive ? (
                  <Icon
                    name="check-circle"
                    size={20}
                    color={theme.colors.success}
                  />
                ) : (
                  <Icon name="x" size={20} color={theme.colors.error} />
                )}
                <ThemedText
                  textStyle={TextStyle.Header}
                  style={styles.statValue}
                >
                  {currentLeague.isActive ? "Active" : "Inactive"}
                </ThemedText>
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.statLabel}
                >
                  Active Status
                </ThemedText>
              </View>
            </View>

            {/* About Section */}
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Icon name="info" size={20} color={theme.colors.primary} />
                <ThemedText textStyle={TextStyle.Subheader}>
                  About This League
                </ThemedText>
              </View>
              <ThemedText textStyle={TextStyle.Body} style={styles.description}>
                {currentLeague.description}
              </ThemedText>
            </Card>

            {/* League Details Card */}
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Icon name="list" size={20} color={theme.colors.primary} />
                <ThemedText textStyle={TextStyle.Subheader}>
                  League Details
                </ThemedText>
              </View>
              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <Icon
                    name="map-pin"
                    size={18}
                    color={theme.colors.text + "80"}
                  />
                  <View>
                    <ThemedText textStyle={TextStyle.BodySmall}>
                      Location
                    </ThemedText>
                    <ThemedText textStyle={TextStyle.Body}>
                      {currentLeague.location}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Icon
                    name="calendar"
                    size={18}
                    color={theme.colors.text + "80"}
                  />
                  <View>
                    <ThemedText textStyle={TextStyle.BodySmall}>
                      Days
                    </ThemedText>
                    <ThemedText textStyle={TextStyle.Body}>
                      {currentLeague.leagueDays.join(", ")}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Icon
                    name="clock"
                    size={18}
                    color={theme.colors.text + "80"}
                  />
                  <View>
                    <ThemedText textStyle={TextStyle.BodySmall}>
                      Time
                    </ThemedText>
                    <ThemedText textStyle={TextStyle.Body}>
                      {currentLeague.startTime}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Icon
                    name="target"
                    size={18}
                    color={theme.colors.text + "80"}
                  />
                  <View>
                    <ThemedText textStyle={TextStyle.BodySmall}>
                      Skill Level
                    </ThemedText>
                    <ThemedText textStyle={TextStyle.Body}>
                      {currentLeague.skillLevel}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </Card>

            {/* Upcoming League Nights */}
            {isUserMember && leagueNights.length > 0 && (
              <Card style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Icon
                    name="calendar"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <ThemedText textStyle={TextStyle.Subheader}>
                    Upcoming Nights
                  </ThemedText>
                </View>
                {leagueNights.map((night) => (
                  <TouchableOpacity
                    key={night.id}
                    style={[
                      styles.nightCard,
                      {
                        backgroundColor:
                          night.status === "active"
                            ? theme.colors.primary + "10"
                            : "transparent",
                        borderColor:
                          night.status === "active"
                            ? theme.colors.primary
                            : theme.colors.border,
                      },
                    ]}
                    onPress={() => handleNavigateToNight(night.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.nightInfo}>
                      <View style={styles.nightDay}>
                        <ThemedText
                          textStyle={TextStyle.Body}
                          style={styles.nightDayText}
                        >
                          {night.day}
                        </ThemedText>
                        {night.status === "active" && (
                          <View
                            style={[
                              styles.todayBadge,
                              { backgroundColor: theme.colors.primary },
                            ]}
                          >
                            <ThemedText
                              textStyle={TextStyle.BodySmall}
                              style={styles.todayBadgeText}
                            >
                              Today
                            </ThemedText>
                          </View>
                        )}
                      </View>
                      <View style={styles.nightDetails}>
                        <Icon
                          name="calendar"
                          size={14}
                          color={theme.colors.text + "80"}
                        />
                        <ThemedText
                          textStyle={TextStyle.BodySmall}
                          style={styles.nightDetailText}
                        >
                          {night.date}
                        </ThemedText>
                        <Icon
                          name="clock"
                          size={14}
                          color={theme.colors.text + "80"}
                        />
                        <ThemedText
                          textStyle={TextStyle.BodySmall}
                          style={styles.nightDetailText}
                        >
                          {night.time}
                        </ThemedText>
                      </View>
                    </View>
                    <Icon
                      name="chevron-right"
                      size={20}
                      color={theme.colors.text + "60"}
                    />
                  </TouchableOpacity>
                ))}
              </Card>
            )}

            {/* Members Section */}
            {isUserMember && members.length > 0 && (
              <Card style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Icon name="users" size={20} color={theme.colors.primary} />
                  <ThemedText textStyle={TextStyle.Subheader}>
                    Members ({members.length})
                  </ThemedText>
                </View>
                <View style={styles.membersGrid}>
                  {members.slice(0, 6).map((member) => (
                    <View key={member.id} style={[styles.memberCard]}>
                      <View
                        style={[
                          styles.memberAvatar,
                          { backgroundColor: theme.colors.primary + "20" },
                        ]}
                      >
                        <Icon
                          name="user"
                          size={16}
                          color={theme.colors.primary}
                        />
                      </View>
                      <ThemedText
                        textStyle={TextStyle.BodySmall}
                        style={styles.memberName}
                      >
                        {member.name.split(" ")[0]}
                      </ThemedText>
                    </View>
                  ))}
                </View>
                {members.length > 6 && (
                  <ThemedText
                    textStyle={TextStyle.BodySmall}
                    style={styles.moreMembers}
                  >
                    +{members.length - 6} more members
                  </ThemedText>
                )}
              </Card>
            )}

            {/* Call to Action for Non-Members */}
            {!isUserMember && (
              <View
                style={[
                  styles.ctaCard,
                  { backgroundColor: theme.colors.primary + "10" },
                ]}
              >
                <Icon name="user-add" size={32} color={theme.colors.primary} />
                <ThemedText
                  textStyle={TextStyle.Subheader}
                  style={styles.ctaTitle}
                >
                  Join This League
                </ThemedText>
                <ThemedText textStyle={TextStyle.Body} style={styles.ctaText}>
                  Become a member to access league nights, view members, and
                  compete in matches!
                </ThemedText>
                <Button
                  text="Join Now"
                  onPress={handleJoinLeave}
                  loading={joining}
                  disabled={joining}
                  leftIcon="user-add"
                />
              </View>
            )}

            {/* Join/Leave Button */}
            <Button
              text={isUserMember ? "Leave League" : "Join League"}
              variant={isUserMember ? "outline" : "primary"}
              onPress={handleJoinLeave}
              loading={joining || leaving}
              disabled={joining || leaving}
              leftIcon={isUserMember ? "x" : "user-add"}
              style={styles.joinButton}
            />
          </View>
        </View>
      </ScrollView>
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
  heroSection: {
    paddingHorizontal: padding,
    alignItems: "center",
    zIndex: 2,
    overflow: "visible",
    borderBottomWidth: 1,
  },
  activeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: rounding,
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
    marginBottom: spacing.lg,
  },
  leagueIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  leagueName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  quickInfo: {
    gap: gap.sm,
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  quickInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm - 2,
  },
  quickInfoText: {
    opacity: 0.8,
  },
  joinButton: {
    width: "100%",
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    gap: gap.md,
    width: "100%",
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: spacing.lg,
    alignItems: "center",
    gap: gap.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    opacity: 0.7,
    fontSize: 11,
    textAlign: "center",
  },
  contentSection: {
    paddingBottom: spacing.xxxl + 8,
    zIndex: 1,
  },
  contentSectionInner: {
    padding: padding,
    marginTop: spacing.lg,
    gap: gap.lg,
  },
  sectionCard: { padding: padding, gap: gap.lg },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
  },
  description: {
    opacity: 0.8,
    lineHeight: 22,
  },
  detailsGrid: {
    gap: gap.lg,
    alignItems: "flex-start",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: gap.md,
  },
  nightCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: padding,
    borderRadius: roundingLarge,
    borderWidth: 2,
  },
  nightInfo: {
    flex: 1,
    gap: gap.sm,
  },
  nightDay: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
  },
  nightDayText: {
    fontWeight: "600",
  },
  todayBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: roundingLarge,
  },
  todayBadgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  nightDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm - 2,
  },
  nightDetailText: {
    opacity: 0.7,
    fontSize: 12,
  },
  membersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: gap.md,
  },
  memberCard: {
    width: "30%",
    alignItems: "center",
    gap: gap.sm,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  memberName: {
    textAlign: "center",
    fontSize: 11,
  },
  moreMembers: {
    textAlign: "center",
    opacity: 0.6,
    marginTop: spacing.sm,
  },
  ctaCard: {
    alignItems: "center",
    gap: gap.lg,
    padding: spacing.xxl,
    borderRadius: spacing.lg,
  },
  ctaTitle: {
    textAlign: "center",
  },
  ctaText: {
    textAlign: "center",
    opacity: 0.8,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});
