import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Refresh, ScreenContainer, SearchBar } from "../../components";
import { useTheme } from "../../core/theme";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { useAuthState } from "../../features/auth/state";
import { League } from "../../features/leagues/types";
import { LeaguesStackParamList } from "../../navigation/types";
import {
  GlobalStyles,
  padding,
  paddingSmall,
  paddingXLarge,
} from "../../core/styles";
import { Routes } from "../../navigation/routes";
import {
  LeagueCard,
  LeagueFilters,
  EmptyLeagues,
  FilterType,
} from "../../features/leagues/components";

type NavigationProp = NativeStackNavigationProp<LeaguesStackParamList>;

export const BrowseLeaguesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuthState();
  const leagues = useLeaguesState((state) => state.leagues);
  const loading = useLeaguesState((state) => state.loading);
  const fetchLeagues = useLeaguesState((state) => state.fetchLeagues);
  const getMemberships = useMembershipState((state) => state.getMemberships);
  const memberships = useMembershipState((state) => state.memberships);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchLeagues();
    if (user) {
      getMemberships(user.id);
    }
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

  const renderLeagueCard = ({ item: league }: { item: League }) => (
    <LeagueCard
      league={league}
      isTonight={isTonight(league)}
      isMember={memberships[league.id] ? true : false}
      onPress={() =>
        navigation.navigate(Routes.LeagueDetail, { leagueId: league.id })
      }
    />
  );

  return (
    <ScreenContainer style={{ padding: padding }}>
      <View>
        <SearchBar
          containerStyle={styles.searchInput}
          placeholder="Search leagues, locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <LeagueFilters selectedFilter={filter} onFilterChange={setFilter} />
      </View>
      <Refresh
        data={filteredLeagues}
        renderItem={renderLeagueCard}
        keyExtractor={(item: League) => item.id.toString()}
        refreshing={loading}
        onRefresh={fetchLeagues}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: paddingSmall,
  },
  listContent: {
    ...GlobalStyles.container,
    paddingBottom: paddingXLarge + 8,
  },
});
