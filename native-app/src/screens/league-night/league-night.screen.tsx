import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemedText, ScreenContainer } from "../../components";
import { useTheme } from "../../core/theme";
import { TextStyle } from "../../core/styles";
import { useAuthState } from "../../features/auth/state";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { useLeagueNightState } from "../../features/league-nights/state";
import { useLeagueNightRealtime } from "../../hooks/useLeagueNightRealtime";
import { LeaguesStackParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";

// Import tab screens
import { MyNightTab, MyNightTabProps } from "./tabs/my-night.tab";
import { MatchesQueueTab } from "./tabs/matches-queue.tab";
import { LeagueInfoTab } from "./tabs/league-info.tab";
import { AdminTab, AdminTabProps } from "./tabs/admin.tab";
import { Membership } from "../../features/membership/types";

const Tab = createMaterialTopTabNavigator();

type LeagueNightRouteProp = RouteProp<
  LeaguesStackParamList,
  Routes.LeagueNight
>;
type LeagueNightNavigationProp = NativeStackNavigationProp<
  LeaguesStackParamList,
  Routes.LeagueNight
>;

export const LeagueNightScreen = () => {
  const route = useRoute<LeagueNightRouteProp>();
  const navigation = useNavigation<LeagueNightNavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuthState();
  const { fetchLeague, currentLeague } = useLeaguesState();
  const { memberships, fetchMembership } = useMembershipState();

  // League night state from Zustand
  const {
    leagueNight,
    checkedInPlayers,
    partnershipRequests,
    confirmedPartnership,
    currentMatch,
    loading,
    checkingIn,
    unchecking,
    sendingRequest,
    acceptingRequest,
    rejectingRequest,
    removingPartnership,
    startingLeague,
    endingLeague,
    fetchLeagueNight,
    refreshCheckedInPlayers,
    refreshPartnershipRequests,
    checkInPlayer,
    uncheckPlayer,
    sendPartnershipRequest,
    acceptPartnershipRequest,
    rejectPartnershipRequest,
    removePartnership,
    startLeague,
    endLeague,
  } = useLeagueNightState();

  const { leagueId, nightId } = route.params;
  const [membership, setMembership] = useState<Membership | null>(null);
  const [matchesRefreshTrigger, setMatchesRefreshTrigger] = useState(0);

  // Check if user is checked in
  const isCheckedIn = user
    ? checkedInPlayers.some((p) => p.id === user.id)
    : false;

  // Check if user is admin
  const isAdmin = membership?.role === "admin";

  useEffect(() => {
    if (memberships[leagueId]) {
      setMembership(memberships[leagueId]);
    }
  }, [memberships, leagueId]);

  // Initialize data on mount
  useEffect(() => {
    fetchLeague(leagueId);
    if (user) {
      fetchMembership(leagueId, user.id);
    }
    fetchLeagueNight(leagueId, nightId);
    refreshCheckedInPlayers(leagueId, nightId);
    if (user) {
      refreshPartnershipRequests(leagueId, nightId, user.id);
    }
  }, [leagueId, nightId, user]);

  // Set up real-time subscriptions
  useLeagueNightRealtime(leagueId, nightId, {
    onCheckinsUpdate: () => refreshCheckedInPlayers(leagueId, nightId),
    onPartnershipRequestsUpdate: () => {
      if (user) {
        refreshPartnershipRequests(leagueId, nightId, user.id);
      }
    },
    onMatchesUpdate: () => {
      setMatchesRefreshTrigger((prev) => prev + 1);
      if (user) {
        refreshPartnershipRequests(leagueId, nightId, user.id);
      }
    },
    onLeagueNightStatusUpdate: () => fetchLeagueNight(leagueId, nightId),
  });

  // Handlers that call Zustand actions
  const handleCheckIn = () => {
    if (user) checkInPlayer(leagueId, nightId, user.id);
  };

  const handleUncheck = () => {
    if (user) uncheckPlayer(leagueId, nightId, user.id);
  };

  const handleSendPartnershipRequest = (partnerId: string) => {
    if (user) sendPartnershipRequest(leagueId, nightId, user.id, partnerId);
  };

  const handleAcceptPartnershipRequest = (requestId: string) => {
    if (user) acceptPartnershipRequest(leagueId, nightId, requestId, user.id);
  };

  const handleRejectPartnershipRequest = (requestId: string) => {
    if (user) rejectPartnershipRequest(leagueId, nightId, requestId, user.id);
  };

  const handleRemovePartnership = () => {
    if (user) removePartnership(leagueId, nightId, user.id);
  };

  const handleStartLeague = () => {
    if (user) startLeague(leagueId, nightId, user.id);
  };

  const handleEndLeague = () => {
    if (user) endLeague(leagueId, nightId, user.id);
  };

  const handleScoreSubmitted = () => {
    if (user) {
      refreshPartnershipRequests(leagueId, nightId, user.id);
    }
    setMatchesRefreshTrigger((prev) => prev + 1);
  };

  const handleMatchesCreated = () => {
    fetchLeagueNight(leagueId, nightId);
    if (user) {
      refreshPartnershipRequests(leagueId, nightId, user.id);
    }
  };

  if (loading || !leagueNight) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.Body} style={styles.loadingText}>
            Loading league night...
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  // Common props for all tabs
  const tabProps: MyNightTabProps = {
    user,
    leagueId,
    nightId,
    league: currentLeague,
    leagueNight,
    isCheckedIn,
    checkedInPlayers,
    partnershipRequests,
    confirmedPartnership,
    currentMatch,
    checkingIn,
    unchecking,
    sendingRequest,
    acceptingRequest,
    rejectingRequest,
    removingPartnership,
    onCheckIn: handleCheckIn,
    onUncheck: handleUncheck,
    onSendPartnershipRequest: handleSendPartnershipRequest,
    onAcceptPartnershipRequest: handleAcceptPartnershipRequest,
    onRejectPartnershipRequest: handleRejectPartnershipRequest,
    onRemovePartnership: handleRemovePartnership,
    onScoreSubmitted: handleScoreSubmitted,
  };

  const adminTabProps: AdminTabProps = {
    ...tabProps,
    isAdmin,
    startingLeague,
    endingLeague,
    onStartLeague: handleStartLeague,
    onEndLeague: handleEndLeague,
    onMatchesCreated: handleMatchesCreated,
  };

  return (
    <ScreenContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text + "60",
          tabBarStyle: {
            backgroundColor: theme.componentBackground,
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            textTransform: "none",
          },
          swipeEnabled: true,
        }}
      >
        <Tab.Screen name="MyNight" options={{ title: "My Night" }}>
          {() => <MyNightTab {...tabProps} />}
        </Tab.Screen>
        <Tab.Screen name="Matches" options={{ title: "Matches" }}>
          {() => (
            <MatchesQueueTab
              {...tabProps}
              matchesRefreshTrigger={matchesRefreshTrigger}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Info" options={{ title: "League Info" }}>
          {() => <LeagueInfoTab {...tabProps} />}
        </Tab.Screen>
        {isAdmin && (
          <Tab.Screen name="Admin" options={{ title: "Admin" }}>
            {() => <AdminTab {...adminTabProps} />}
          </Tab.Screen>
        )}
      </Tab.Navigator>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
});
