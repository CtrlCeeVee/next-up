import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Container,
  Refresh,
  ScreenContainer,
  SearchBar,
  ShimmerComponent,
} from "../../components";
import { useTheme } from "../../core/theme";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { useAuthState } from "../../features/auth/state";
import { League } from "../../features/leagues/types";
import { LeaguesStackParamList } from "../../navigation/types";
import {
  gap,
  GlobalStyles,
  padding,
  paddingSmall,
  paddingXLarge,
  rounding,
} from "../../core/styles";
import { Routes } from "../../navigation/routes";
import {
  LeagueCard,
  LeagueFilters,
  FilterType,
} from "../../features/leagues/components";
import { getService, InjectableType } from "../../di";
import { LeaguesService } from "../../features/leagues/services";
import { MembershipService } from "../../features/membership/services";
import { DayOfWeek } from "../../core/types";

type NavigationProp = NativeStackNavigationProp<LeaguesStackParamList>;

export const BrowseLeaguesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthState();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [memberships, setMemberships] = useState<Record<string, boolean>>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const leaguesService = getService<LeaguesService>(InjectableType.LEAGUES);
  const membershipService = getService<MembershipService>(
    InjectableType.MEMBERSHIP
  );

  const fetchLeagues = async () => {
    if (!user) return;
    try {
      if (!leagues || leagues.length === 0) {
        setLoading(true);
      }

      const newLeagues = await leaguesService.getAll();

      setLeagues(newLeagues);
    } catch (error) {
      console.error("Error fetching leagues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, [user]);

  useEffect(() => {
    async function fetchMemberships() {
      if (!user) return;
      try {
        const membershipsResponse = await membershipService.getAll(user.id);
        const membershipsMap = membershipsResponse.memberships.reduce(
          (acc, membershipResponse) => {
            acc[membershipResponse.membership.leagueId] = true;
            return acc;
          },
          {} as Record<string, boolean>
        );
        setMemberships(membershipsMap);
      } catch (error) {
        console.error("Error fetching leagues:", error);
      }
    }
    fetchMemberships();
  }, [user]);

  // Check if league is happening today
  const isTonight = (league: League) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return league.leagueDays.includes(today as DayOfWeek);
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

  const refresh = async () => {
    setRefreshing(true);
    await fetchLeagues();
    setRefreshing(false);
  };

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

  const renderShimmers = () =>
    [...Array(2)].map((_, index) => (
      <ShimmerComponent
        key={index}
        width="100%"
        height={140}
        rounding={rounding}
        renderCardUnderneath={true}
      />
    ));

  return (
    <ScreenContainer style={{ padding: padding }}>
      <Container column>
        <SearchBar
          containerStyle={styles.searchInput}
          placeholder="Search leagues, locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <LeagueFilters selectedFilter={filter} onFilterChange={setFilter} />
      </Container>
      {loading ? (
        <Container column w100 gap={gap.md}>
          {renderShimmers()}
        </Container>
      ) : (
        <Refresh
          style={{ width: "100%" }}
          data={filteredLeagues}
          renderItem={renderLeagueCard}
          keyExtractor={(item: League) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={refresh}
        />
      )}
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
