import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Platform,
  useWindowDimensions,
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
  Container,
  LazyImage,
  ScrollArea,
  MapSnapshot,
  AppBottomSheet,
  ActionOnBackdropPress,
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
  defaultIconSize,
  roundingFull,
  roundingMedium,
  paddingSmall,
  paddingLarge,
  MIN_TEXTLESS_BUTTON_SIZE,
} from "../../core/styles";
import { useAuthState } from "../../features/auth/state";
import { useLeaguesState } from "../../features/leagues/state";
import { useMembershipState } from "../../features/membership/state";
import { LeaguesStackParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";
import { useLeagueNightState } from "../../features/league-nights/state";
import { leagueNightsService } from "../../di/services.registry";
import { LeagueNightInstance, Match } from "../../features/league-nights/types";
import {
  LeagueDaysSummary,
  LeagueDaysComponentSize,
  LeagueInfoComponent,
  LeagueNightsComponent,
  LeagueSettingsComponent,
} from "../../features/leagues/components";
import { TabConfig, TabScreen } from "../../components/tab-screen.component";
import { HoverActionsComponent } from "../../components/hover-actions.component";
import { ActiveLeagueNightComponent } from "../../features/league-nights/components/active-league-night.component";
import { LeagueMembersComponent } from "../../features/leagues/components/league-members.component";
import { TobBar } from "../../components/top-bar.component";
import { HoverButton } from "../../components/hover-button.component";
import { DateUtility } from "../../core/utilities";

type LeagueDetailRouteProp = RouteProp<
  LeaguesStackParamList,
  Routes.LeagueDetail
>;
type LeagueDetailNavigationProp = NativeStackNavigationProp<
  LeaguesStackParamList,
  Routes.LeagueDetail
>;

const SOFT_HYPHEN = "\u00AD";
const MAX_WORD_SEGMENT_LENGTH = 12;
const LEAGUE_ACTIONS_SNAP_POINTS: Array<string> = ["20%", "75%"];
const LEAGUE_ACTIONS_FIRST_SNAP_FALLBACK = 140;

const hyphenateLongWord = (word: string): string => {
  if (word.length <= MAX_WORD_SEGMENT_LENGTH) {
    return word;
  }

  const wordSegments = word.match(
    new RegExp(`.{1,${MAX_WORD_SEGMENT_LENGTH}}`, "g")
  );

  if (!wordSegments) {
    return word;
  }

  return wordSegments.join(SOFT_HYPHEN);
};

const hyphenateLeagueName = (leagueName: string): string => {
  return leagueName
    .split(" ")
    .map((word) => hyphenateLongWord(word))
    .join(" ");
};

export const LeagueDetailScreen = () => {
  const route = useRoute<LeagueDetailRouteProp>();
  const navigation = useNavigation<LeagueDetailNavigationProp>();
  const { theme, isDark } = useTheme();
  const { user } = useAuthState();
  const fetchLeague = useLeaguesState((state) => state.fetchLeague);
  const currentLeague = useLeaguesState((state) => state.currentLeague);
  const leagueLoading = useLeaguesState((state) => state.loading);

  const isMember = useMembershipState((state) => state.isMember);
  const leaveLeague = useMembershipState((state) => state.leaveLeague);
  const joining = useMembershipState((state) => state.joining);
  const leaving = useMembershipState((state) => state.leaving);
  const membersByLeague = useMembershipState((state) => state.membersByLeague);

  const { leagueId } = route.params as { leagueId: string };

  const [leagueNights, setLeagueNights] = useState<LeagueNightInstance[]>([]);
  const [activeLeagueNight, setActiveLeagueNight] =
    useState<LeagueNightInstance | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLeagueActionsSheetOpen, setIsLeagueActionsSheetOpen] =
    useState(true);
  const [leagueActionsSheetStage, setLeagueActionsSheetStage] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const [isSheetHandleShown] = useState(false);
  const [leagueActionsContentHeight, setLeagueActionsContentHeight] = useState<
    number | null
  >(0);

  useEffect(() => {
    fetchLeague(leagueId);
    fetchLeagueNights();
  }, [leagueId, user]);

  useEffect(() => {
    fetchMatches();
  }, [activeLeagueNight, user]);

  const fetchLeagueNights = async () => {
    const response = await leagueNightsService.getAllLeagueNights(leagueId);
    setLeagueNights(response);
    setActiveLeagueNight(
      response.find((night) => night.status === "active") || null
    );
  };

  const fetchMatches = async () => {
    if (!activeLeagueNight || !user) return;
    const response = await leagueNightsService.getMatches(
      leagueId,
      activeLeagueNight.id,
      user.id
    );
    setMatches(response);
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

  const isUserMember = isMember(leagueId);

  const getNextUpActivity = () => {
    return leagueNights.find((night) => night.status === "scheduled");
  };

  const renderHeaderComponent = () => {
    const nextUpActivity = getNextUpActivity();
    return (
      <Container column centerHorizontal>
        <Container column centerHorizontal>
          <View
            style={[
              styles.leagueIcon,
              {
                backgroundColor: theme.colors.primary + "20",
                borderColor: theme.colors.primary + "40",
              },
            ]}
          >
            <Icon
              name="trophy"
              size={defaultIconSize}
              color={theme.colors.primary}
            />
          </View>

          <ThemedText textStyle={TextStyle.Header}>
            {currentLeague.name}
          </ThemedText>
        </Container>
      </Container>
    );
  };

  const getTabs = (): TabConfig[] => {
    const tabs: TabConfig[] = [
      {
        name: "Details",
        component: (
          <LeagueInfoComponent
            league={currentLeague}
            leagueNights={[
              {
                leagueId,
                day: "Monday",
                time: "10:00 AM",
                date: "2026-01-01",
                status: "scheduled",
                courtsAvailable: 4,
                courtLabels: ["Court 1", "Court 2", "Court 3", "Court 4"],
                autoAssignmentEnabled: false,
                checkedInCount: 0,
                partnershipsCount: 0,
                possibleGames: 0,
                checkins: [],
                partnerships: [],
                requests: [],
                id: "1",
              },
            ]}
          />
        ),
      },
      {
        name: "Active",
        component: (
          <ActiveLeagueNightComponent
            league={currentLeague}
            leagueNight={activeLeagueNight || undefined}
            matches={matches}
          />
        ),
        options: {
          tabBarActiveTintColor: theme.colors.accent,
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.accent,
          },
        },
      },
      {
        name: "Upcoming",
        component: (
          <LeagueNightsComponent
            leagueNights={leagueNights}
            isUserMember={isUserMember}
            leagueId={leagueId}
          />
        ),
      },
    ];

    return tabs;
  };

  const isLeagueNightToday = () => {
    return leagueNights.some((night) => DateUtility.isToday(night.date));
  };

  const getLeagueDays = () => {
    const days = currentLeague.leagueDays;
    if (!days || days.length === 0) return "No schedule set";

    if (days.length === 1) return days[0] + "s";
    if (days.length === 2) return days[0] + "s and " + days[1] + "s";
    return days.slice(0, -1).join(", ") + " and " + days[days.length - 1] + "s";
  };

  const getSnapPointHeight = (snapPoint: string | number): number => {
    if (typeof snapPoint === "number") {
      return snapPoint;
    }

    if (snapPoint.endsWith("%")) {
      const parsedPercent = Number.parseFloat(snapPoint.replace("%", ""));
      if (Number.isNaN(parsedPercent)) {
        return 0;
      }

      return windowHeight * (parsedPercent / 100);
    }

    const parsedNumber = Number.parseFloat(snapPoint);
    if (Number.isNaN(parsedNumber)) {
      return 0;
    }

    return parsedNumber;
  };

  const getCurrentSheetInset = (): number => {
    if (!isLeagueActionsSheetOpen) {
      return 0;
    }

    return firstLeagueActionsSnapPointHeight;
  };

  const secondLeagueActionsSnapPointHeight = getSnapPointHeight(
    LEAGUE_ACTIONS_SNAP_POINTS[1]
  );
  const measuredLeagueActionsContentHeight =
    leagueActionsContentHeight ?? LEAGUE_ACTIONS_FIRST_SNAP_FALLBACK;
  const firstLeagueActionsSnapPointHeight = Math.max(
    1,
    Math.min(
      measuredLeagueActionsContentHeight,
      secondLeagueActionsSnapPointHeight - 1
    )
  );
  const leagueActionsSnapPoints: Array<string | number> = [
    firstLeagueActionsSnapPointHeight,
    LEAGUE_ACTIONS_SNAP_POINTS[1],
  ];

  return (
    <ScreenContainer safeAreaColour={theme.backgroundGradient[0]}>
      <TobBar showBackButton={true} showSettingsButton={false} />
      <ScrollArea
        innerPadding={0}
        contentGap={gap.lg}
        bottomInset={getCurrentSheetInset()}
      >
        <Container
          column
          w100
          style={{ height: 180, position: "relative" }}
          padding={padding}
        >
          <LazyImage
            source={{
              uri: "https://cdn.benchmarkpt.com/wp-content/uploads/2024/03/pickleball-injuries-benchmarkpt-newsletter-image-2048x1368-01-min-1347x900-1.jpg",
            }}
            width="100%"
            height="100%"
            rounding={rounding}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />
          <Container
            style={{
              position: "absolute",
              top: padding + paddingSmall,
              left: padding + paddingSmall,
              zIndex: 1,
            }}
          >
            <LeagueMembersComponent
              members={[
                {
                  id: "1",
                  name: "John Doe",
                  email: "john.doe@example.com",
                  skillLevel: "Beginner",
                  role: "player",
                  joinedAt: new Date().toISOString(),
                },
                {
                  id: "2",
                  name: "Jane Doe",
                  email: "jane.doe@example.com",
                  skillLevel: "Beginner",
                  role: "player",
                  joinedAt: new Date().toISOString(),
                },
              ]}
              isMember={false}
            />
          </Container>

          <Container
            style={{
              position: "absolute",
              bottom: padding + paddingSmall,
              right: padding + paddingSmall,
              zIndex: 1,
            }}
          >
            {activeLeagueNight && !isLeagueNightToday() && (
              <Container
                row
                centerVertical
                paddingVertical={paddingSmall}
                paddingHorizontal={padding}
                rounding={rounding}
                style={{
                  backgroundColor: theme.colors.accent,
                }}
              >
                <Icon name="moon" size={16} color={"white"} />
                <ThemedText textStyle={TextStyle.BodyMedium} color={"white"}>
                  Active now
                </ThemedText>
              </Container>
            )}
            {!activeLeagueNight && isLeagueNightToday() && (
              <Container
                row
                centerVertical
                paddingVertical={paddingSmall}
                paddingHorizontal={padding}
                rounding={rounding}
                style={{
                  backgroundColor: theme.colors.primary,
                }}
              >
                <Icon name="calendar" size={16} color={"white"} />
                <ThemedText textStyle={TextStyle.BodyMedium} color={"white"}>
                  Today
                </ThemedText>
              </Container>
            )}
          </Container>
        </Container>

        {/* League Info */}
        <Container column w100 gap={gap.sm} paddingHorizontal={padding}>
          <Container column w100>
            {isUserMember && (
              <Container row centerVertical gap={2}>
                <Icon
                  name="check-circle"
                  size={12}
                  color={theme.colors.primary}
                />
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  color={theme.colors.primary}
                >
                  Member
                </ThemedText>
              </Container>
            )}
            <Container row spaceBetween w100 style={styles.leagueNameRow}>
              <Container column gap={gap.xs} style={styles.leagueNameContainer}>
                <ThemedText
                  textStyle={TextStyle.Header}
                  style={styles.leagueNameText}
                >
                  {hyphenateLeagueName(currentLeague.name)}
                </ThemedText>
              </Container>

              <TouchableOpacity
                onPress={() => {
                  setLeagueActionsSheetStage(0);
                  setIsLeagueActionsSheetOpen(true);
                }}
                style={styles.heartButtonContainer}
                accessibilityRole="button"
                accessibilityLabel="Toggle favorite league"
              >
                <Container
                  column
                  centerHorizontal
                  centerVertical
                  rounding={roundingFull}
                  padding={paddingSmall}
                  style={{
                    backgroundColor: theme.colors.text + "10",
                  }}
                >
                  <Icon
                    name="heart"
                    size={16}
                    color={theme.colors.text + "60"}
                  />
                </Container>
              </TouchableOpacity>
            </Container>
          </Container>

          <Container row centerVertical gap={gap.sm}>
            <Icon name="map-pin" size={16} color={theme.colors.text + "60"} />
            <ThemedText textStyle={TextStyle.BodyMedium} muted>
              {currentLeague.location}
            </ThemedText>
          </Container>

          <Container row centerVertical gap={gap.sm}>
            <Icon name="calendar" size={16} color={theme.colors.text + "60"} />
            <ThemedText textStyle={TextStyle.BodyMedium} muted>
              {getLeagueDays()}
            </ThemedText>
          </Container>
        </Container>

        {/* Upcoming League Nights */}
        <Container
          column
          w100
          gap={gap.sm}
          style={{
            paddingLeft: padding,
            ...(leagueNights.length === 0 && { paddingRight: padding }),
          }}
        >
          <ThemedText textStyle={TextStyle.Body}>Upcoming Nights</ThemedText>
          <LeagueNightsComponent
            leagueNights={leagueNights}
            isUserMember={isUserMember}
            leagueId={leagueId}
          />
        </Container>

        {/* Venue Info */}
        <Container column w100 gap={gap.sm} paddingHorizontal={padding}>
          <ThemedText textStyle={TextStyle.Body}>Venue</ThemedText>
          <Container w100>
            <MapSnapshot
              latitude={currentLeague.latitude || 0}
              longitude={currentLeague.longitude || 0}
              width="100%"
              height={200}
              rounding={rounding}
              style={{ width: "100%", height: 200, zIndex: 0 }}
            />
            <TouchableOpacity
              onPress={() => {}}
              style={{
                borderRadius: rounding,
                paddingVertical: paddingSmall,
                paddingHorizontal: padding,
                position: "absolute",
                bottom: padding,
                right: padding,
                backgroundColor: "#2563eb",
                zIndex: 1,
              }}
            >
              <Container row centerVertical gap={gap.sm}>
                <Icon name="open-external" size={16} color={"#dddddd"} />
                <ThemedText textStyle={TextStyle.BodyMedium} color={"#dddddd"}>
                  Open in {Platform.OS === "ios" ? "Maps" : "Google Maps"}
                </ThemedText>
              </Container>
            </TouchableOpacity>
          </Container>
        </Container>
      </ScrollArea>

      {((isUserMember && activeLeagueNight) || !isUserMember) && (
        <AppBottomSheet
          isOpen={isLeagueActionsSheetOpen}
          showHandle={isSheetHandleShown}
          onClose={() => setIsLeagueActionsSheetOpen(false)}
          enableDynamicSizing={false}
          enableDragging={true}
          allowSwipeToClose={false}
          actionOnBackdropPress={ActionOnBackdropPress.COLLAPSE}
          snapPoints={leagueActionsSnapPoints}
          initialSnapIndex={0}
          backdropAppearsOnIndex={1}
          backdropDisappearsOnIndex={0}
          onStageChange={(stageIndex) => {
            if (stageIndex >= 0) {
              setLeagueActionsSheetStage(stageIndex);
            }
          }}
          sheetBackgroundStyle={{
            ...(activeLeagueNight &&
              isUserMember && { backgroundColor: "#33236A" }),
            ...(!isUserMember && {
              backgroundColor: theme.colors.primaryDark,
            }),
          }}
          onContentLayout={(height) => {
            if (height > 0) {
              setLeagueActionsContentHeight(height);
            }
          }}
        >
          {isUserMember && activeLeagueNight && (
            <Container row spaceBetween centerVertical w100 gap={gap.sm}>
              <Container column gap={0}>
                <Container row centerVertical gap={gap.sm}>
                  <Icon name="moon" size={16} color={"#ffffff"} />
                  <ThemedText textStyle={TextStyle.Body}>Live Now</ThemedText>
                </Container>
                <ThemedText textStyle={TextStyle.BodySmall} color="#cbcbcb">
                  League Night started at 13:00
                </ThemedText>
              </Container>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.accent,
                  paddingVertical: paddingSmall,
                  paddingHorizontal: padding,
                  borderRadius: rounding,
                }}
                onPress={() => {}}
              >
                <ThemedText
                  textStyle={TextStyle.BodyMedium}
                  color={"white"}
                  growHorizontal
                  center
                >
                  Check in
                </ThemedText>
              </TouchableOpacity>
            </Container>
          )}

          {!isUserMember && (
            <Container row spaceBetween centerVertical w100 gap={gap.sm}>
              <Container column gap={0}>
                <Container row centerVertical gap={gap.sm}>
                  <Icon name="user-add" size={16} color={"#ffffff"} />
                  <ThemedText textStyle={TextStyle.Body}>
                    Become a member
                  </ThemedText>
                </Container>
              </Container>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: paddingSmall,
                  paddingHorizontal: paddingLarge,
                  borderRadius: rounding,
                }}
                onPress={() => {}}
              >
                <ThemedText
                  textStyle={TextStyle.BodyMedium}
                  color={"white"}
                  growHorizontal
                  center
                >
                  Join
                </ThemedText>
              </TouchableOpacity>
            </Container>
          )}
        </AppBottomSheet>
      )}
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
  leagueIcon: {
    width: defaultIconSize + 20,
    height: defaultIconSize + 20,
    borderRadius: roundingFull,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nextUpActivity: {
    gap: gap.sm,
    borderRadius: roundingMedium,
  },
  leagueNameRow: {
    alignItems: "flex-start",
  },
  leagueNameContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: gap.sm,
  },
  leagueNameText: {
    flexShrink: 1,
  },
  heartButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: MIN_TEXTLESS_BUTTON_SIZE,
    height: MIN_TEXTLESS_BUTTON_SIZE,
  },
});
