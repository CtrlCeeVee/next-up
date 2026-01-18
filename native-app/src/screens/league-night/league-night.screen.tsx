import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemedText, ScreenContainer } from "../../components";
import { useTheme } from "../../core/theme";
import { useAuthState } from "../../features/auth/state";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { leagueNightsService } from "../../di/services.registry";
import { useLeagueNightRealtime } from "../../hooks/useLeagueNightRealtime";
import { LeaguesStackParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";
import type {
  LeagueNightInstance,
  CheckedInPlayer,
  PartnershipRequest,
  ConfirmedPartnership,
} from "../../features/league-nights/types";

// Import tab screens
import { MyNightTab } from "./tabs/my-night.tab";
import { MatchesQueueTab } from "./tabs/matches-queue.tab";
import { LeagueInfoTab } from "./tabs/league-info.tab";
import { AdminTab } from "./tabs/admin.tab";

const Tab = createMaterialTopTabNavigator();

type LeagueNightRouteProp = RouteProp<LeaguesStackParamList, Routes.LeagueNight>;
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
  const { membership, fetchMembership } = useMembershipState();

  const { leagueId, nightId } = route.params;

  // League night state
  const [leagueNight, setLeagueNight] = useState<LeagueNightInstance | null>(null);
  const [loading, setLoading] = useState(true);

  // Check-in state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [unchecking, setUnchecking] = useState(false);
  const [checkedInPlayers, setCheckedInPlayers] = useState<CheckedInPlayer[]>([]);

  // Partnership state
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>([]);
  const [confirmedPartnership, setConfirmedPartnership] = useState<ConfirmedPartnership | null>(
    null
  );
  const [currentMatch, setCurrentMatch] = useState<any | null>(null);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const [acceptingRequest, setAcceptingRequest] = useState<number | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<number | null>(null);
  const [removingPartnership, setRemovingPartnership] = useState(false);

  // Admin state
  const [startingLeague, setStartingLeague] = useState(false);
  const [endingLeague, setEndingLeague] = useState(false);

  // Refresh triggers
  const [matchesRefreshTrigger, setMatchesRefreshTrigger] = useState(0);

  // Check if user is admin
  const isAdmin = membership?.role === "admin" || membership?.role === "organizer";

  // Fetch league night data
  const fetchLeagueNight = useCallback(async () => {
    if (!leagueId || !nightId) return;

    try {
      setLoading(true);
      const nightData = await leagueNightsService.getLeagueNight(leagueId, nightId);
      setLeagueNight(nightData);
    } catch (error) {
      console.error("Error fetching league night:", error);
    } finally {
      setLoading(false);
    }
  }, [leagueId, nightId]);

  // Refresh checked-in players
  const refreshCheckedInPlayers = useCallback(async () => {
    if (!leagueId || !nightId) return;

    try {
      const players = await leagueNightsService.getCheckedInPlayers(leagueId, nightId);
      setCheckedInPlayers(players);

      // Check if current user is checked in
      if (user) {
        const userCheckedIn = players.some((p) => p.userId === user.id);
        setIsCheckedIn(userCheckedIn);
      }
    } catch (error) {
      console.error("Error refreshing checked-in players:", error);
    }
  }, [leagueId, nightId, user]);

  // Refresh partnership requests
  const refreshPartnershipRequests = useCallback(async () => {
    if (!leagueId || !nightId || !user) return;

    try {
      const requests = await leagueNightsService.getPartnershipRequests(leagueId, nightId);
      setPartnershipRequests(requests);

      // Get confirmed partnership
      const partnership = await leagueNightsService.getConfirmedPartnership(
        leagueId,
        nightId,
        user.id
      );
      setConfirmedPartnership(partnership);

      // Get current match
      if (partnership) {
        const match = await leagueNightsService.getCurrentMatch(
          leagueId,
          nightId,
          partnership.id
        );
        setCurrentMatch(match);
      }
    } catch (error) {
      console.error("Error refreshing partnership requests:", error);
    }
  }, [leagueId, nightId, user]);

  // Initialize data on mount
  useEffect(() => {
    fetchLeague(leagueId);
    if (user) {
      fetchMembership(leagueId, user.id);
    }
    fetchLeagueNight();
    refreshCheckedInPlayers();
    refreshPartnershipRequests();
  }, [leagueId, nightId, user]);

  // Set up real-time subscriptions
  useLeagueNightRealtime(
    leagueId,
    nightId,
    {
      onCheckInChange: refreshCheckedInPlayers,
      onPartnershipChange: refreshPartnershipRequests,
      onMatchChange: () => {
        setMatchesRefreshTrigger((prev) => prev + 1);
        refreshPartnershipRequests();
      },
      onLeagueNightUpdate: fetchLeagueNight,
    },
    !!leagueNight
  );

  // Check-in handler
  const handleCheckIn = async () => {
    if (!user || checkingIn) return;

    setCheckingIn(true);
    try {
      await leagueNightsService.checkInPlayer(leagueId, nightId, user.id);
      await Promise.all([refreshCheckedInPlayers(), refreshPartnershipRequests()]);
    } catch (error) {
      console.error("Error checking in:", error);
    } finally {
      setCheckingIn(false);
    }
  };

  // Uncheck handler
  const handleUncheck = async () => {
    if (!user || unchecking) return;

    setUnchecking(true);
    try {
      await leagueNightsService.uncheckPlayer(leagueId, nightId, user.id);
      await Promise.all([refreshCheckedInPlayers(), refreshPartnershipRequests()]);
    } catch (error) {
      console.error("Error unchecking:", error);
    } finally {
      setUnchecking(false);
    }
  };

  // Send partnership request
  const handleSendPartnershipRequest = async (partnerId: string) => {
    if (!user || sendingRequest) return;

    setSendingRequest(partnerId);
    try {
      await leagueNightsService.sendPartnershipRequest(leagueId, nightId, user.id, partnerId);
      await refreshPartnershipRequests();
    } catch (error) {
      console.error("Error sending partnership request:", error);
    } finally {
      setSendingRequest(null);
    }
  };

  // Accept partnership request
  const handleAcceptPartnershipRequest = async (requestId: number) => {
    if (!user || acceptingRequest) return;

    setAcceptingRequest(requestId);
    try {
      await leagueNightsService.acceptPartnershipRequest(leagueId, nightId, requestId, user.id);
      await Promise.all([refreshCheckedInPlayers(), refreshPartnershipRequests()]);
    } catch (error) {
      console.error("Error accepting partnership request:", error);
    } finally {
      setAcceptingRequest(null);
    }
  };

  // Reject partnership request
  const handleRejectPartnershipRequest = async (requestId: number) => {
    if (!user || rejectingRequest) return;

    setRejectingRequest(requestId);
    try {
      await leagueNightsService.rejectPartnershipRequest(leagueId, nightId, requestId, user.id);
      await refreshPartnershipRequests();
    } catch (error) {
      console.error("Error rejecting partnership request:", error);
    } finally {
      setRejectingRequest(null);
    }
  };

  // Remove partnership
  const handleRemovePartnership = async () => {
    if (!user || removingPartnership) return;

    setRemovingPartnership(true);
    try {
      await leagueNightsService.removePartnership(leagueId, nightId, user.id);
      await Promise.all([refreshCheckedInPlayers(), refreshPartnershipRequests()]);
    } catch (error) {
      console.error("Error removing partnership:", error);
    } finally {
      setRemovingPartnership(false);
    }
  };

  // Start league night (admin)
  const handleStartLeague = async () => {
    if (!user || startingLeague) return;

    setStartingLeague(true);
    try {
      await leagueNightsService.startLeague(leagueId, nightId, user.id);
      await fetchLeagueNight();
    } catch (error) {
      console.error("Error starting league:", error);
    } finally {
      setStartingLeague(false);
    }
  };

  // End league night (admin)
  const handleEndLeague = async () => {
    if (!user || endingLeague) return;

    setEndingLeague(true);
    try {
      await leagueNightsService.endLeague(leagueId, nightId, user.id);
      await fetchLeagueNight();
    } catch (error) {
      console.error("Error ending league:", error);
    } finally {
      setEndingLeague(false);
    }
  };

  // Handle score submitted
  const handleScoreSubmitted = () => {
    refreshPartnershipRequests();
    setMatchesRefreshTrigger((prev) => prev + 1);
  };

  // Handle matches created
  const handleMatchesCreated = () => {
    fetchLeagueNight();
    refreshPartnershipRequests();
  };

  if (loading || !leagueNight) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText styleType="Body" style={styles.loadingText}>
            Loading league night...
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  // Common props for all tabs
  const tabProps = {
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

  const adminTabProps = {
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
        <Tab.Screen
          name="MyNight"
          options={{ title: "My Night" }}
        >
          {() => <MyNightTab {...tabProps} />}
        </Tab.Screen>
        <Tab.Screen
          name="Matches"
          options={{ title: "Matches" }}
        >
          {() => (
            <MatchesQueueTab
              {...tabProps}
              matchesRefreshTrigger={matchesRefreshTrigger}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Info"
          options={{ title: "League Info" }}
        >
          {() => <LeagueInfoTab {...tabProps} />}
        </Tab.Screen>
        {isAdmin && (
          <Tab.Screen
            name="Admin"
            options={{ title: "Admin" }}
          >
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
