import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { ThemedText, Card, ScreenContainer } from "../../components";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import { GlobalStyles, padding, TextStyle } from "../../core/styles";
import { useAuthState } from "../../features/auth/state";
import { useProfilesState } from "../../features/profiles/state";

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
  trend?: "up" | "down" | "neutral";
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subValue,
  color,
  trend,
}) => {
  const { theme } = useTheme();
  const cardColor = color || theme.colors.primary;

  return (
    <Card style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: cardColor + "20" }]}>
        <Icon name={icon} size={24} color={cardColor} />
      </View>
      <View style={styles.statContent}>
        <ThemedText textStyle={TextStyle.BodySmall} style={styles.statLabel}>
          {label}
        </ThemedText>
        <View style={styles.statValueRow}>
          <ThemedText textStyle={TextStyle.Header} style={[styles.statValue, { color: cardColor }]}>
            {value}
          </ThemedText>
          {trend && (
            <Icon
              name={trend === "up" ? "trending-up" : trend === "down" ? "trending-down" : "minus"}
              size={20}
              color={trend === "up" ? theme.colors.success : trend === "down" ? theme.colors.error : theme.colors.text}
            />
          )}
        </View>
        {subValue && (
          <ThemedText textStyle={TextStyle.BodySmall} style={styles.statSubValue}>
            {subValue}
          </ThemedText>
        )}
      </View>
    </Card>
  );
};

export const StatsScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuthState();
  const { stats, streaks, fetchStats, fetchStreaks, loading } = useProfilesState();

  useEffect(() => {
    if (user) {
      fetchStats(user.id);
      fetchStreaks(user.id);
    }
  }, [user]);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.Body} style={styles.loadingText}>
            Loading your stats...
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  const winRate = stats?.winRate?.toFixed(1) || "0.0";
  const avgPoints = stats?.averagePoints?.toFixed(1) || "0.0";
  const currentStreak = streaks?.currentStreak || 0;
  const bestStreak = streaks?.bestStreak || 0;

  const renderStats = () => {
    return (
      <View>
<View style={styles.section}>
<View style={styles.sectionHeader}>
  <Icon name="trophy" size={20} color={theme.colors.primary} />
  <ThemedText textStyle={TextStyle.Subheader}>Overall Performance</ThemedText>
</View>

<View style={styles.statsGrid}>
  <StatCard
    icon="trophy"
    label="Total Games"
    value={stats?.totalGames || 0}
    color={theme.colors.primary}
  />
  <StatCard
    icon="check-circle"
    label="Wins"
    value={stats?.wins || 0}
    subValue={`${winRate}% win rate`}
    color={theme.colors.success}
  />
  <StatCard
    icon="alert-circle"
    label="Losses"
    value={stats?.losses || 0}
    color={theme.colors.error}
  />
  <StatCard
    icon="target"
    label="Avg Points"
    value={avgPoints}
    subValue={`${stats?.totalPoints || 0} total`}
    color="#f97316"
  />
</View>
</View>

{/* Streaks Section */}
<View style={styles.section}>
<View style={styles.sectionHeader}>
  <Icon name="flame" size={20} color="#f97316" />
  <ThemedText textStyle={TextStyle.Subheader}>Streaks</ThemedText>
</View>

<Card style={styles.streakCard}>
  <View style={styles.streakRow}>
    <View style={styles.streakItem}>
      <View
        style={[
          styles.streakIconContainer,
          {
            backgroundColor:
              currentStreak > 0
                ? theme.colors.success + "20"
                : currentStreak < 0
                ? theme.colors.error + "20"
                : theme.colors.text + "10",
          },
        ]}
      >
        <Icon
          name={currentStreak > 0 ? "trending-up" : currentStreak < 0 ? "trending-down" : "minus"}
          size={28}
          color={
            currentStreak > 0
              ? theme.colors.success
              : currentStreak < 0
              ? theme.colors.error
              : theme.colors.text
          }
        />
      </View>
      <ThemedText textStyle={TextStyle.BodySmall} style={styles.streakLabel}>
        Current Streak
      </ThemedText>
      <ThemedText
        textStyle={TextStyle.Header}
        style={[
          styles.streakValue,
          {
            color:
              currentStreak > 0
                ? theme.colors.success
                : currentStreak < 0
                ? theme.colors.error
                : theme.colors.text,
          },
        ]}
      >
        {Math.abs(currentStreak)}
      </ThemedText>
      <ThemedText textStyle={TextStyle.BodySmall} style={styles.streakSubValue}>
        {currentStreak > 0 ? "wins" : currentStreak < 0 ? "losses" : "games"}
      </ThemedText>
    </View>

    <View style={[styles.divider, { backgroundColor: theme.colors.text + "20" }]} />

    <View style={styles.streakItem}>
      <View
        style={[
          styles.streakIconContainer,
          { backgroundColor: "#a855f7" + "20" },
        ]}
      >
        <Icon name="star" size={28} color="#a855f7" />
      </View>
      <ThemedText textStyle={TextStyle.BodySmall} style={styles.streakLabel}>
        Best Streak
      </ThemedText>
      <ThemedText
        textStyle={TextStyle.Header}
        style={[styles.streakValue, { color: "#a855f7" }]}
      >
        {bestStreak}
      </ThemedText>
      <ThemedText textStyle={TextStyle.BodySmall} style={styles.streakSubValue}>
        wins
      </ThemedText>
    </View>
  </View>
</Card>
</View>

{/* League Stats Section */}
<View style={styles.section}>
<View style={styles.sectionHeader}>
  <Icon name="users" size={20} color={theme.colors.primary} />
  <ThemedText textStyle={TextStyle.Subheader}>League Activity</ThemedText>
</View>

<View style={styles.leagueStatsGrid}>
  <Card style={styles.leagueStatCard}>
    <Icon name="trophy" size={24} color={theme.colors.primary} />
    <ThemedText textStyle={TextStyle.Header} style={styles.leagueStatValue}>
      {stats?.leaguesJoined || 0}
    </ThemedText>
    <ThemedText textStyle={TextStyle.BodySmall} style={styles.leagueStatLabel}>
      Leagues Joined
    </ThemedText>
  </Card>

  <Card style={styles.leagueStatCard}>
    <Icon name="zap" size={24} color={theme.colors.success} />
    <ThemedText textStyle={TextStyle.Header} style={styles.leagueStatValue}>
      {stats?.activeLeagues || 0}
    </ThemedText>
    <ThemedText textStyle={TextStyle.BodySmall} style={styles.leagueStatLabel}>
      Active Now
    </ThemedText>
  </Card>
</View>
</View>

{/* Performance Insights */}
<View style={styles.section}>
<View style={styles.sectionHeader}>
  <Icon name="trending-up" size={20} color={theme.colors.primary} />
  <ThemedText textStyle={TextStyle.Subheader}>Insights</ThemedText>
</View>

<Card style={styles.insightsCard}>
  {stats && stats.totalGames > 0 ? (
    <>
      {stats.winRate >= 50 && (
        <View style={styles.insightRow}>
          <View
            style={[
              styles.insightIcon,
              { backgroundColor: theme.colors.success + "20" },
            ]}
          >
            <Icon name="trending-up" size={20} color={theme.colors.success} />
          </View>
          <View style={styles.insightContent}>
            <ThemedText textStyle={TextStyle.Body} style={styles.insightText}>
              Great performance! You're winning more than half your games.
            </ThemedText>
          </View>
        </View>
      )}

      {currentStreak >= 3 && (
        <View style={styles.insightRow}>
          <View
            style={[
              styles.insightIcon,
              { backgroundColor: "#f97316" + "20" },
            ]}
          >
            <Icon name="flame" size={20} color="#f97316" />
          </View>
          <View style={styles.insightContent}>
            <ThemedText textStyle={TextStyle.Body} style={styles.insightText}>
              You're on fire! Keep up the winning streak!
            </ThemedText>
          </View>
        </View>
      )}

      {stats.averagePoints >= 10 && (
        <View style={styles.insightRow}>
          <View
            style={[
              styles.insightIcon,
              { backgroundColor: theme.colors.primary + "20" },
            ]}
          >
            <Icon name="target" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.insightContent}>
            <ThemedText textStyle={TextStyle.Body} style={styles.insightText}>
              Impressive scoring! You're averaging double digits per game.
            </ThemedText>
          </View>
        </View>
      )}

      {stats.totalGames >= 50 && (
        <View style={styles.insightRow}>
          <View
            style={[
              styles.insightIcon,
              { backgroundColor: "#a855f7" + "20" },
            ]}
          >
            <Icon name="star" size={20} color="#a855f7" />
          </View>
          <View style={styles.insightContent}>
            <ThemedText textStyle={TextStyle.Body} style={styles.insightText}>
              Veteran player! You've played {stats.totalGames} games.
            </ThemedText>
          </View>
        </View>
      )}

      {stats.winRate < 50 && stats.totalGames >= 5 && (
        <View style={styles.insightRow}>
          <View
            style={[
              styles.insightIcon,
              { backgroundColor: theme.colors.primary + "20" },
            ]}
          >
            <Icon name="heart" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.insightContent}>
            <ThemedText textStyle={TextStyle.Body} style={styles.insightText}>
              Keep practicing! Every game makes you better.
            </ThemedText>
          </View>
        </View>
      )}
    </>
  ) : (
    <View style={styles.emptyInsights}>
      <Icon name="info" size={32} color={theme.colors.text + "40"} />
      <ThemedText textStyle={TextStyle.Body} style={styles.emptyInsightsText}>
        Play more games to unlock personalized insights!
      </ThemedText>
    </View>
  )}
</Card>
</View>
</View>
  )
  }

  const renderNoStats = () => {
    return (
      <View style={styles.emptyStateContainer}>
    <Icon name="bar-chart" size={48} color={theme.colors.text + "40"} />
    <ThemedText textStyle={TextStyle.Subheader} style={styles.emptyStateTitle}>
      No Stats Yet
    </ThemedText>
    <ThemedText textStyle={TextStyle.Body} style={styles.emptyStateText}>
      Join a league and play some games to see your statistics here!
    </ThemedText>
  </View>
  )
  }

  const render = () => {
    return (
      <>
    {(stats || streaks) && (
      <View>
        {renderStats()}
      </View>
    )}
    {(!stats || stats.totalGames === 0) && (
      <View>
        {renderNoStats()}
      </View>
    )}
    </>
  )
  }

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {render()}
      </ScrollView>
    </ScreenContainer>
  )
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: padding,
    paddingBottom: padding * 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  loadingText: {
    opacity: 0.7,
  },
  header: {
    marginBottom: 32,
    gap: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
  },
  headerSubtext: {
    textAlign: "center",
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  statCard: {
    ...GlobalStyles.container,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "48.5%",
    minWidth: "48.5%",
    maxWidth: "48.5%",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    opacity: 0.7,
    fontSize: 11,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statSubValue: {
    opacity: 0.6,
    fontSize: 10,
  },
  streakCard: {
    ...GlobalStyles.container,
  },
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  streakItem: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  streakIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  streakLabel: {
    opacity: 0.7,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: "700",
  },
  streakSubValue: {
    opacity: 0.6,
  },
  divider: {
    width: 1,
    height: "100%",
  },
  leagueStatsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  leagueStatCard: {
    ...GlobalStyles.container,
    flex: 1,
    alignItems: "center",
    gap: 12,
  },
  leagueStatValue: {
    fontSize: 32,
    fontWeight: "700",
  },
  leagueStatLabel: {
    opacity: 0.7,
    textAlign: "center",
  },
  insightsCard: {
    ...GlobalStyles.container,
    gap: 16,
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  insightContent: {
    flex: 1,
    justifyContent: "center",
  },
  insightText: {
    lineHeight: 20,
  },
  emptyInsights: {
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  emptyInsightsText: {
    opacity: 0.7,
    textAlign: "center",
  },
  emptyStateContainer: {
    ...GlobalStyles.container,
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  emptyStateTitle: {
    textAlign: "center",
  },
  emptyStateText: {
    opacity: 0.7,
    textAlign: "center",
  },
});
