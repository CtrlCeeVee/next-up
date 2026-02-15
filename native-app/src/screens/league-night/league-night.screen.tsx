import React from "react";
import { StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LeaguesStackParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";

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
  // const route = useRoute<LeagueNightRouteProp>();
  // const navigation = useNavigation<LeagueNightNavigationProp>();
  // const { theme } = useTheme();
  // const { user } = useAuthState();
  // const { leagues, fetchLeagues } = useLeaguesState();
  // const { memberships } = useMembershipState();

  // // League night state
  // const leagueNight = useLeagueNightState((state) => state.leagueNightInstance);
  // const checkedInPlayers = useLeagueNightState(
  //   (state) => state.checkedInPlayers
  // );
  // const partnershipRequests = useLeagueNightState(
  //   (state) => state.partnershipRequests
  // );
  // const confirmedPartnership = useLeagueNightState(
  //   (state) => state.confirmedPartnership
  // );
  // const currentMatch = useLeagueNightState((state) => state.currentMatch);
  // const loading = useLeagueNightState((state) => state.loading);
  // const checkingIn = useLeagueNightState((state) => state.checkingIn);
  // const unchecking = useLeagueNightState((state) => state.unchecking);
  // const sendingRequest = useLeagueNightState((state) => state.sendingRequest);
  // const acceptingRequest = useLeagueNightState(
  //   (state) => state.acceptingRequest
  // );
  // const rejectingRequest = useLeagueNightState(
  //   (state) => state.rejectingRequest
  // );
  // const removingPartnership = useLeagueNightState(
  //   (state) => state.removingPartnership
  // );
  // const startingLeague = useLeagueNightState((state) => state.startingLeague);
  // const endingLeague = useLeagueNightState((state) => state.endingLeague);
  // const fetchLeagueNight = useLeagueNightState(
  //   (state) => state.fetchLeagueNight
  // );
  // const refreshCheckedInPlayers = useLeagueNightState(
  //   (state) => state.refreshCheckedInPlayers
  // );
  // const refreshPartnershipRequests = useLeagueNightState(
  //   (state) => state.refreshPartnershipRequests
  // );
  // const checkInPlayer = useLeagueNightState((state) => state.checkInPlayer);
  // const uncheckPlayer = useLeagueNightState((state) => state.uncheckPlayer);
  // const sendPartnershipRequest = useLeagueNightState(
  //   (state) => state.sendPartnershipRequest
  // );
  // const acceptPartnershipRequest = useLeagueNightState(
  //   (state) => state.acceptPartnershipRequest
  // );
  // const rejectPartnershipRequest = useLeagueNightState(
  //   (state) => state.rejectPartnershipRequest
  // );
  // const removePartnership = useLeagueNightState(
  //   (state) => state.removePartnership
  // );
  // const startLeague = useLeagueNightState((state) => state.startLeague);
  // const endLeague = useLeagueNightState((state) => state.endLeague);

  // // Navigation state
  // const { leagueId, nightId } = route.params;

  // // UI state
  // const [membership, setMembership] = useState<Membership | null>(null);
  // const [matchesRefreshTrigger, setMatchesRefreshTrigger] = useState(0);
  // const [isCheckedIn, setIsCheckedIn] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);

  // // useEffect(() => {
  // //   refreshCheckedInPlayers(leagueId, nightId);
  // // });

  // useEffect(() => {
  //   const isCheckedIn = user
  //     ? checkedInPlayers.some((p) => p.id === user.id)
  //     : false;
  //   setIsCheckedIn(isCheckedIn);
  // }, [checkedInPlayers]);

  // useEffect(() => {
  //   if (memberships[leagueId]) {
  //     setMembership(memberships[leagueId]);
  //     setIsAdmin(membership?.role === "admin");
  //   }
  // }, [memberships, leagueId]);

  // // Initialize data on mount
  // useEffect(() => {
  //   fetchLeague(leagueId);
  //   fetchLeagueNight(leagueId, nightId);
  // }, [leagueId, nightId, user]);

  // // Set up real-time subscriptions

  // useLeagueNightRealtime(nightId, user, {
  //   onCheckinsUpdate: () => refreshCheckedInPlayers(leagueId, nightId),
  //   onPartnershipRequestsUpdate: () => {
  //     if (user) {
  //       refreshPartnershipRequests(leagueId, nightId, user.id);
  //     }
  //   },
  //   onMatchesUpdate: () => {
  //     setMatchesRefreshTrigger((prev) => prev + 1);
  //     if (user) {
  //       refreshPartnershipRequests(leagueId, nightId, user.id);
  //     }
  //   },
  //   onLeagueNightStatusUpdate: () => fetchLeagueNight(leagueId, nightId),
  // });

  // // Handlers that call Zustand actions
  // const handleCheckIn = () => {
  //   if (user) checkInPlayer(leagueId, nightId, user.id);
  // };

  // const handleUncheck = () => {
  //   if (user) uncheckPlayer(leagueId, nightId, user.id);
  // };

  // const handleSendPartnershipRequest = (partnerId: string) => {
  //   if (user) sendPartnershipRequest(leagueId, nightId, user.id, partnerId);
  // };

  // const handleAcceptPartnershipRequest = (requestId: string) => {
  //   if (user) acceptPartnershipRequest(leagueId, nightId, requestId, user.id);
  // };

  // const handleRejectPartnershipRequest = (requestId: string) => {
  //   if (user) rejectPartnershipRequest(leagueId, nightId, requestId, user.id);
  // };

  // const handleRemovePartnership = () => {
  //   if (user) removePartnership(leagueId, nightId, user.id);
  // };

  // const handleStartLeague = () => {
  //   if (user) startLeague(leagueId, nightId, user.id);
  // };

  // const handleEndLeague = () => {
  //   if (user) endLeague(leagueId, nightId, user.id);
  // };

  // const handleScoreSubmitted = () => {
  //   if (user) {
  //     refreshPartnershipRequests(leagueId, nightId, user.id);
  //   }
  //   setMatchesRefreshTrigger((prev) => prev + 1);
  // };

  // const handleMatchesCreated = () => {
  //   fetchLeagueNight(leagueId, nightId);
  //   if (user) {
  //     refreshPartnershipRequests(leagueId, nightId, user.id);
  //   }
  // };

  // if (loading || !leagueNight) {
  //   return (
  //     <ScreenContainer>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color={theme.colors.primary} />
  //         <ThemedText textStyle={TextStyle.Body} style={styles.loadingText}>
  //           Loading league night...
  //         </ThemedText>
  //       </View>
  //     </ScreenContainer>
  //   );
  // }

  // // Common props for all tabs
  // const tabProps: MyNightTabProps = {
  //   user,
  //   leagueId,
  //   nightId,
  //   league: currentLeague,
  //   leagueNight,
  //   isCheckedIn,
  //   checkedInPlayers,
  //   partnershipRequests,
  //   confirmedPartnership,
  //   currentMatch,
  //   checkingIn,
  //   unchecking,
  //   sendingRequest,
  //   acceptingRequest,
  //   rejectingRequest,
  //   removingPartnership,
  //   onCheckIn: handleCheckIn,
  //   onUncheck: handleUncheck,
  //   onSendPartnershipRequest: handleSendPartnershipRequest,
  //   onAcceptPartnershipRequest: handleAcceptPartnershipRequest,
  //   onRejectPartnershipRequest: handleRejectPartnershipRequest,
  //   onRemovePartnership: handleRemovePartnership,
  //   onScoreSubmitted: handleScoreSubmitted,
  // };

  // const adminTabProps: AdminTabProps = {
  //   ...tabProps,
  //   isAdmin,
  //   startingLeague,
  //   endingLeague,
  //   onStartLeague: handleStartLeague,
  //   onEndLeague: handleEndLeague,
  //   onMatchesCreated: handleMatchesCreated,
  // };

  // return (
  //   <ScreenContainer>
  //     <Tab.Navigator
  //       screenOptions={{
  //         tabBarActiveTintColor: theme.colors.primary,
  //         tabBarInactiveTintColor: theme.colors.text + "60",
  //         tabBarStyle: {
  //           backgroundColor: "transparent",
  //           marginHorizontal: padding,
  //         },
  //         tabBarIndicatorStyle: {
  //           backgroundColor: theme.colors.primary,
  //         },
  //         tabBarLabelStyle: {
  //           fontSize: 12,
  //           fontWeight: "600",
  //           textTransform: "none",
  //         },
  //         swipeEnabled: true,
  //       }}
  //     >
  //       <Tab.Screen name="MyNight" options={{ title: "My Night" }}>
  //         {() => <MyNightTab {...tabProps} />}
  //       </Tab.Screen>
  //       <Tab.Screen name="Matches" options={{ title: "Matches" }}>
  //         {() => (
  //           <MatchesQueueTab
  //             {...tabProps}
  //             matchesRefreshTrigger={matchesRefreshTrigger}
  //           />
  //         )}
  //       </Tab.Screen>
  //       <Tab.Screen name="Info" options={{ title: "Info" }}>
  //         {() => <LeagueInfoTab {...tabProps} />}
  //       </Tab.Screen>
  //       {isAdmin && (
  //         <Tab.Screen name="Admin" options={{ title: "Admin" }}>
  //           {() => <AdminTab {...adminTabProps} />}
  //         </Tab.Screen>
  //       )}
  //     </Tab.Navigator>
  //   </ScreenContainer>
  // );
  return <></>;
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
