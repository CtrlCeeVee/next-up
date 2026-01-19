import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ThemedText,
  Card,
  ScreenContainer,
  LoadingSpinner,
} from "../../components";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { useAuthState } from "../../features/auth/state";
import { League } from "../../features/leagues/types";
import { LeaguesStackParamList } from "../../navigation/types";
import { GlobalStyles, TextStyle } from "../../core/styles";
import { Routes } from "../../navigation/routes";
import { BadgeComponent } from "../../components/badge.component";

type NavigationProp = NativeStackNavigationProp<LeaguesStackParamList>;

type FilterType = "all" | "tonight" | "mine";

export const BrowseLeaguesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuthState();
  const { leagues, loading, fetchLeagues } = useLeaguesState();
  const { isMember, checkMembership } = useMembershipState();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchLeagues();
  }, [user]);

  // Check if league is happening today
  const isTonight = (league: League) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return league.leagueDays?.includes(today) ?? false;
  };

  const filteredLeagues = leagues.filter((league) => {
    if (filter === "tonight" && !isTonight(league)) return false;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        league.name.toLowerCase().includes(query) ||
        league.location?.toLowerCase().includes(query) ||
        league.description?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const renderLeagueCard = ({ item: league }: { item: League }) => {
    const tonight = isTonight(league);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(Routes.LeagueDetail, { leagueId: league.id })
        }
      >
        <Card style={styles.leagueCard} variant="elevated">
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardTitleContainer}>
                <View style={styles.badgeContainer}>
                  {tonight && <BadgeComponent icon="zap" text="Tonight" />}
                  {isMember(league.id) && (
                    <BadgeComponent
                      icon="check-circle"
                      text="Member"
                      color={isDark ? "#6497f5" : "#2862c9"}
                    />
                  )}
                </View>
                <ThemedText
                  textStyle={TextStyle.Body}
                  style={styles.leagueName}
                >
                  {league.name}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Description */}
          {league.description && (
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={styles.description}
            >
              {league.description}
            </ThemedText>
          )}

          {/* Info */}
          <View style={styles.infoContainer}>
            {league.location && (
              <View style={styles.infoRow}>
                <Icon
                  name="map-pin"
                  size={16}
                  color={theme.colors.text + "80"}
                />
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.infoText}
                >
                  {league.location}
                </ThemedText>
              </View>
            )}
            {league.leagueDays && league.leagueDays.length > 0 && (
              <View style={styles.infoRow}>
                <Icon
                  name="calendar"
                  size={16}
                  color={theme.colors.text + "80"}
                />
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.infoText}
                >
                  {league.leagueDays.join(", ")}
                </ThemedText>
              </View>
            )}
            {league.startTime && (
              <View style={styles.infoRow}>
                <Icon name="clock" size={16} color={theme.colors.text + "80"} />
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.infoText}
                >
                  {league.startTime}
                </ThemedText>
              </View>
            )}
            {league.totalPlayers !== undefined && (
              <View style={styles.infoRow}>
                <Icon name="users" size={16} color={theme.colors.text + "80"} />
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  style={styles.infoText}
                >
                  {league.totalPlayers} players
                </ThemedText>
              </View>
            )}
          </View>

          <View style={styles.arrowContainer}>
            <Icon name="chevron-right" size={20} color={theme.colors.text} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer style={{ padding: 10 }}>
      <View>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.componentBackground,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Icon name="search" size={20} color={theme.colors.text + "60"} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search leagues, locations..."
            placeholderTextColor={theme.colors.text + "60"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          {[
            {
              value: "all" as const,
              label: "All Leagues",
              icon: "trophy" as const,
            },
            {
              value: "tonight" as const,
              label: "Tonight",
              icon: "zap" as const,
            },
            {
              value: "mine" as const,
              label: "My Leagues",
              icon: "user" as const,
            },
          ].map((f) => (
            <TouchableOpacity
              key={f.value}
              onPress={() => setFilter(f.value)}
              style={[
                styles.filterPill,
                {
                  backgroundColor:
                    filter === f.value
                      ? theme.colors.primary
                      : theme.componentBackground,
                  borderColor:
                    filter === f.value
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <Icon
                name={f.icon}
                size={16}
                color={filter === f.value ? "#FFFFFF" : theme.colors.text}
              />
              <ThemedText
                textStyle={TextStyle.BodySmall}
                style={[
                  styles.filterText,
                  {
                    color: filter === f.value ? "#FFFFFF" : theme.colors.text,
                  },
                ]}
              >
                {f.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={filteredLeagues}
        renderItem={renderLeagueCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<></>}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search" size={48} color={theme.colors.text + "40"} />
            <ThemedText textStyle={TextStyle.Body} style={styles.emptyText}>
              No leagues found
            </ThemedText>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchLeagues}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchLeagues}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.componentBackground}
          />
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    opacity: 0.7,
  },
  listContent: {
    ...GlobalStyles.container,
    paddingBottom: 32,
  },
  searchContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  searchInput: {
    fontSize: 16,
    marginLeft: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterText: {
    fontWeight: "600",
  },
  leagueCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconBadge: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleContainer: {
    flex: 1,
    gap: 6,
    justifyContent: "center",
  },
  leagueName: {
    fontWeight: "700",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontWeight: "600",
    fontSize: 11,
  },
  tonightBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  description: {
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    opacity: 0.8,
  },
  arrowContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyText: {
    opacity: 0.5,
  },
});
