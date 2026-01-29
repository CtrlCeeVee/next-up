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
import { ThemedText, Card, Button, ScreenContainer } from "../../components";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import { GlobalStyles, padding, TextStyle, spacing, gap, roundingLarge } from "../../core/styles";
import { useAuthState } from "../../features/auth/state";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { LeaguesStackParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";

type LeagueDetailRouteProp = RouteProp<
  LeaguesStackParamList,
  Routes.LeagueDetail
>;
type LeagueDetailNavigationProp = NativeStackNavigationProp<
  LeaguesStackParamList,
  Routes.LeagueDetail
>;

interface LeagueNight {
  id: string;
  day: string;
  date: string;
  time: string;
  status: "upcoming" | "today" | "past";
}

export const LeagueDetailScreen = () => {
  const route = useRoute<LeagueDetailRouteProp>();
  const navigation = useNavigation<LeagueDetailNavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuthState();
  const {
    fetchLeague,
    currentLeague,
    loading: leagueLoading,
  } = useLeaguesState();
  const {
    isMember,
    joinLeague,
    leaveLeague,
    joining,
    leaving,
    membersByLeague,
  } = useMembershipState();

  const { leagueId } = route.params as { leagueId: string };

  const [leagueNights, setLeagueNights] = useState<LeagueNight[]>([]);

  useEffect(() => {
    fetchLeague(leagueId);
  }, [leagueId, user]);

  // Generate upcoming league nights
  useEffect(() => {
    if (!currentLeague) return;

    const getNextDateForDay = (dayName: string): Date => {
      const today = new Date();
      const targetDay = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(dayName);
      const todayDay = today.getDay();
      let daysUntilTarget = targetDay - todayDay;

      if (daysUntilTarget < 0) {
        daysUntilTarget += 7;
      }

      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysUntilTarget);
      return targetDate;
    };

    const todayName = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    const nights: LeagueNight[] = currentLeague.leagueDays.map((day, index) => {
      const nextDate = getNextDateForDay(day);
      const isToday = day === todayName;

      return {
        id: `night-${index}`,
        day,
        date: nextDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        time: currentLeague.startTime,
        status: isToday ? "today" : "upcoming",
      };
    });

    // Sort by date
    nights.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime());

    setLeagueNights(nights);
  }, [currentLeague]);

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
        {/* Hero Section with Gradient */}
        <View style={styles.heroSection}>
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

          {/* Quick Info */}
          <View style={styles.quickInfo}>
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
          </View>

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

          {/* Stats Quick View */}
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.componentBackground + "99" },
              ]}
            >
              <Icon name="users" size={20} color={theme.colors.primary} />
              <ThemedText textStyle={TextStyle.Header} style={styles.statValue}>
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
              <ThemedText textStyle={TextStyle.Header} style={styles.statValue}>
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
              <ThemedText textStyle={TextStyle.Header} style={styles.statValue}>
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
        </View>

        {/* Content Section */}
        <View
          style={[
            styles.contentSection,
            { backgroundColor: theme.colors.background },
          ]}
        >
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
                  <ThemedText textStyle={TextStyle.BodySmall}>Days</ThemedText>
                  <ThemedText textStyle={TextStyle.Body}>
                    {currentLeague.leagueDays.join(", ")}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Icon name="clock" size={18} color={theme.colors.text + "80"} />
                <View>
                  <ThemedText textStyle={TextStyle.BodySmall}>Time</ThemedText>
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
                <Icon name="calendar" size={20} color={theme.colors.primary} />
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
                        night.status === "today"
                          ? theme.colors.primary + "10"
                          : "transparent",
                      borderColor:
                        night.status === "today"
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
                      {night.status === "today" && (
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
                  <View
                    key={member.id}
                    style={[
                      styles.memberCard,
                    ]}
                  >
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
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: padding,
    alignItems: "center",
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
    padding: padding,
    paddingTop: spacing.xl + 12,
    paddingBottom: spacing.xxxl + 8,
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
