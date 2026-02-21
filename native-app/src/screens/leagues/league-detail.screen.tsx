import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ThemedText,
  ScreenContainer,
  Container,
  LazyImage,
  ScrollArea,
  MapSnapshot,
  AppBottomSheet,
  ActionOnBackdropPress,
  LoadingSpinner,
  Card,
  ShimmerComponent,
  useModal,
  Button,
} from "../../components";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import {
  padding,
  TextStyle,
  gap,
  rounding,
  defaultIconSize,
  roundingFull,
  roundingMedium,
  paddingSmall,
  MIN_TEXTLESS_BUTTON_SIZE,
  spacing,
} from "../../core/styles";
import { useAuthState } from "../../features/auth/state";
import { LeaguesStackParamList } from "../../navigation/types";
import { Routes } from "../../navigation/routes";
import {
  getService,
  InjectableType,
  leagueNightsService,
  websocketsService,
} from "../../di";
import {
  CheckedInPlayer,
  LeagueNightInstance,
} from "../../features/league-nights/types";
import {
  LeagueLogoComponent,
  LeagueNightsComponent,
} from "../../features/leagues/components";
import { LeagueMembersComponent } from "../../features/leagues/components/league-members.component";
import { TobBar } from "../../components/top-bar.component";
import { DateUtility } from "../../core/utilities";
import { ActiveLeagueNightComponent } from "../../features/league-nights/components";
import { League } from "../../features/leagues/types";
import { LeaguesService } from "../../features/leagues/services";
import { MembershipService } from "../../features/membership/services";
import { Player } from "../../features/player/types";
import { SelectPartnershipEffects } from "../../features/league-nights/components/select-partnership.component";
import { GetCheckedInPlayerResponse } from "../../features/league-nights/services/responses";
import { FavouriteButtonComponent } from "../../components/favourite-button.component";
import { Membership } from "../../features/membership/types";
import { WebsocketsService } from "../../features/websockets/services/websockets.service";
import {
  NativeRealtimeEventName,
  NativeRealtimeMessageType,
} from "../../features/websockets/types";

const SHIMMER_COLOUR = "#dddddd20";

type LeagueDetailRouteProp = RouteProp<
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
  const websocketsService = getService<WebsocketsService>(
    InjectableType.WEBSOCKETS
  );

  const { showCustom, showConfirm, hideModal } = useModal();
  const { theme } = useTheme();
  const { user } = useAuthState();
  const [league, setLeague] = useState<League | null>(null);
  const [leagueLoading, setLeagueLoading] = useState(false);
  const [memberships, setMemberships] = useState<Record<string, Membership>>(
    {}
  );
  const [leagueNights, setLeagueNights] = useState<LeagueNightInstance[]>([]);

  const [leagueActionsSheetStage, setLeagueActionsSheetStage] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const [hasPendingCheckInVisualState, setHasPendingCheckInVisualState] =
    useState(false);
  const [leagueActionsContentHeight, setLeagueActionsContentHeight] = useState<
    number | null
  >(null);
  const [checkedInPlayersResponse, setCheckedInPlayersResponse] = useState<
    GetCheckedInPlayerResponse[]
  >([]);
  const [checkingIn, setCheckingIn] = useState(false);
  const leaguesService = getService<LeaguesService>(InjectableType.LEAGUES);
  const membershipService = getService<MembershipService>(
    InjectableType.MEMBERSHIP
  );
  const [loadingCheckedInPlayers, setLoadingCheckedInPlayers] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const { leagueId } = route.params;

  // debouncer to avoid rapid changes in the bottom sheet visibility
  let bottomSheetOpenStateDebounced: NodeJS.Timeout | null = null;
  const changeBottomSheetVisibility = (visible: boolean) => {
    if (bottomSheetOpenStateDebounced) {
      clearTimeout(bottomSheetOpenStateDebounced);
    }

    bottomSheetOpenStateDebounced = setTimeout(() => {
      setShowBottomSheet(visible);
    }, 100);
  };

  const nextLeagueNight = useMemo(() => {
    if (!leagueNights || leagueNights.length === 0) return null;
    return (
      leagueNights
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .find((night) => night.status !== "completed") || null
    );
  }, [leagueNights]);

  const fetchCheckedInPlayers = async () => {
    if (!nextLeagueNight || !leagueId) return;
    if (loadingCheckedInPlayers) return;

    if (!checkedInPlayersResponse || checkedInPlayersResponse.length === 0) {
      setLoadingCheckedInPlayers(true);
    }

    const response = await leagueNightsService.getCheckedInPlayers(
      leagueId,
      nextLeagueNight.id
    );
    setCheckedInPlayersResponse(response.checkins);
    setLoadingCheckedInPlayers(false);
  };

  const isLoadingLeagueInfo = useMemo(() => {
    return leagueLoading || !league;
  }, [leagueLoading, league]);

  useEffect(() => {
    return websocketsService.subscribe(
      NativeRealtimeEventName.LEAGUE_NIGHT_INSTANCE,
      (status) => {
        const newLeagueNights = leagueNights.filter(
          (night) => night.id !== status.payload.id
        );
        if (
          status.payload.status !== "completed" &&
          status.type !== NativeRealtimeMessageType.DELETE
        ) {
          newLeagueNights.push(status.payload);
        }
        setLeagueNights(newLeagueNights);
      }
    );
  }, [leagueNights, websocketsService]);

  useEffect(() => {
    fetchCheckedInPlayers();
  }, [nextLeagueNight, leagueId]);

  const isLeagueNightToday = () => {
    if (!leagueNights || leagueNights.length === 0) return false;
    return leagueNights.some((night) => DateUtility.isToday(night.date));
  };

  const isUserMember = useMemo(() => {
    return memberships[leagueId] ? true : false;
  }, [memberships, leagueId]);

  const showNextNight = useMemo(() => {
    return !!nextLeagueNight && isUserMember;
  }, [nextLeagueNight, isUserMember]);

  const showJoinLeague = useMemo(() => {
    return !isUserMember;
  }, [isUserMember]);

  const isCheckedIn = useMemo(() => {
    if (!user) return false;
    if (!checkedInPlayersResponse || checkedInPlayersResponse.length === 0) {
      return false;
    }
    const isCheckedIn = checkedInPlayersResponse.some(
      (playerResponse) => playerResponse.checkin.id === user.id
    );
    return isCheckedIn;
  }, [checkedInPlayersResponse, user]);

  const shouldUseCheckedInVisualState =
    isCheckedIn || hasPendingCheckInVisualState;

  const sheetBackgroundColor = useMemo(() => {
    if (showNextNight) {
      if (!shouldUseCheckedInVisualState) return theme.colors.accentDark;
    }

    if (showJoinLeague) {
      return theme.colors.primaryDark;
    }

    return theme.colors.sheetBackground;
  }, [
    showNextNight,
    shouldUseCheckedInVisualState,
    showJoinLeague,
    theme.colors.accentDark,
    theme.colors.primaryDark,
    theme.colors.sheetBackground,
  ]);

  useEffect(() => {
    if (isCheckedIn) {
      setHasPendingCheckInVisualState(true);
      return;
    }

    if (!checkingIn) {
      setHasPendingCheckInVisualState(false);
    }
  }, [checkingIn, isCheckedIn]);

  useEffect(() => {
    setHasPendingCheckInVisualState(false);
  }, [nextLeagueNight?.id, user?.id]);

  const fetchLeague = async () => {
    const response = await leaguesService.getById(leagueId);
    setLeague(response);
  };

  const fetchLeagueNights = async () => {
    const response = await leagueNightsService.getAllLeagueNights(leagueId);
    setLeagueNights(response.nights);
  };

  const fetchMemberships = async () => {
    const response = await membershipService.getLeagueMemberships(leagueId);
    const membershipsMap = response.memberships.reduce(
      (acc, membershipResponse) => {
        acc[membershipResponse.membership.leagueId] =
          membershipResponse.membership;
        return acc;
      },
      {} as Record<string, Membership>
    );
    setMemberships(membershipsMap);
  };

  const fetchAllData = async () => {
    await fetchLeague();
    await fetchLeagueNights();
    await fetchMemberships();
  };

  useEffect(() => {
    const init = async () => {
      setLeagueLoading(true);
      await fetchAllData();
      setLeagueLoading(false);
    };

    init();
  }, [leagueId, user]);

  useEffect(() => {
    const shouldShow =
      !leagueLoading &&
      !loadingCheckedInPlayers &&
      (showNextNight || !isUserMember);

    changeBottomSheetVisibility(shouldShow);
  }, [leagueLoading, loadingCheckedInPlayers, showNextNight, isUserMember]);

  const checkIn = async () => {
    if (!nextLeagueNight || !user || checkingIn) return;
    setCheckingIn(true);
    try {
      await leagueNightsService.checkInPlayer(
        leagueId,
        nextLeagueNight.id,
        user.id
      );
      fetchCheckedInPlayers();
      setLeagueActionsSheetStage(1);
    } catch (error) {
      console.error("Error checking in player:", error);
    } finally {
      setCheckingIn(false);
    }
  };

  const getLeagueDays = () => {
    const days = league?.leagueDays || [];
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
    if (!showBottomSheet) {
      return 0;
    }

    return firstLeagueActionsSnapPointHeight;
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
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

  const getDateString = (date: Date, time: string) => {
    if (DateUtility.isToday(date)) {
      const [hours, minutes] = time.split(":");
      const isNight = Number.parseInt(hours) > 18;
      const hoursAndMinutes = `${hours}:${minutes}`;
      if (isNight) {
        return `Tonight, ${hoursAndMinutes}`;
      }
      return `Today, ${hoursAndMinutes}`;
    }
    return new Date(date).toLocaleDateString("en-US", {
      dateStyle: "full",
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderLiveNow = () => {
    if (!nextLeagueNight) {
      return null;
    }

    return (
      <Container row spaceBetween centerVertical w100>
        <Container column gap={0}>
          <Container row centerVertical gap={gap.sm}>
            <Icon name="moon" size={16} color={"#ffffff"} />
            <ThemedText textStyle={TextStyle.Body}>
              {nextLeagueNight.status === "active" ? "Live Now" : "Next Up"}
            </ThemedText>
          </Container>
          <ThemedText textStyle={TextStyle.BodySmall} color="#cbcbcb">
            League Night -{" "}
            {getDateString(
              new Date(nextLeagueNight.date),
              nextLeagueNight.time
            )}
          </ThemedText>
        </Container>
        {!isCheckedIn && !checkingIn && (
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.accent,
              paddingVertical: paddingSmall,
              paddingHorizontal: padding,
              borderRadius: rounding,
            }}
            onPress={checkIn}
          >
            <ThemedText
              textStyle={TextStyle.BodySmall}
              color={"white"}
              w100
              center
            >
              Check in
            </ThemedText>
          </TouchableOpacity>
        )}
        {isCheckedIn && shouldUseCheckedInVisualState && (
          <ThemedText textStyle={TextStyle.Body} color={"white"}>
            <Icon
              name={
                leagueActionsSheetStage === 0 ? "chevron-up" : "chevron-down"
              }
              size={defaultIconSize}
              color={"white"}
            />
          </ThemedText>
        )}
      </Container>
    );
  };

  const renderJoinLeague = () => {
    return (
      <Container row centerVertical spaceBetween w100>
        <Container row centerVertical gap={gap.sm}>
          <Icon name="user-add" size={defaultIconSize} color={"white"} />
          <ThemedText textStyle={TextStyle.Body} color={"white"}>
            Join League
          </ThemedText>
        </Container>

        <TouchableOpacity
          onPress={() => {
            if (user) {
              setLeagueActionsSheetStage(0);
              membershipService.joinLeague(leagueId, user.id);
            }
          }}
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: paddingSmall,
            paddingHorizontal: padding,
            borderRadius: rounding,
          }}
        >
          <ThemedText textStyle={TextStyle.Body} color={"white"}>
            Join
          </ThemedText>
        </TouchableOpacity>
      </Container>
    );
  };

  const renderSheetContentHeader = () => {
    if (showNextNight) {
      return (
        <TouchableOpacity
          onPress={() => {
            setLeagueActionsSheetStage(leagueActionsSheetStage === 0 ? 1 : 0);
          }}
        >
          {renderLiveNow()}
        </TouchableOpacity>
      );
    } else if (showJoinLeague) {
      return renderJoinLeague();
    }
  };

  const renderSheetBody = () => {
    if (!isCheckedIn || !shouldUseCheckedInVisualState || !league) {
      return null;
    }

    return (
      <ActiveLeagueNightComponent
        league={league}
        leagueNight={nextLeagueNight ?? null}
        showAdminButtons={
          isUserMember && memberships[leagueId]?.role === "admin"
        }
      />
    );
  };

  const renderSheetHeader = () => {
    return (
      <Container
        column
        w100
        paddingHorizontal={padding}
        style={{
          paddingBottom: padding,
        }}
      >
        <Container column w100>
          {renderSheetContentHeader()}
          {checkingIn && (
            <Container w100 centerHorizontal>
              <LoadingSpinner
                size="large"
                message="Checking you in..."
                color={"white"}
              />
            </Container>
          )}
        </Container>
      </Container>
    );
  };

  const showConfirmLeaveLeagueModal = () => {
    showConfirm(
      "Leave this League",
      "Are you sure you want to leave this league? You will no longer be able to participate in league nights.",
      () => {
        // membershipService.leaveLeague(leagueId, user?.id);
      },
      () => {
        hideModal();
      },
      "Leave League",
      "Cancel",
      {
        confirmBackground: theme.colors.danger,
        confirmText: "white",
        cancelBackground: theme.colors.secondary,
        cancelText: "black",
      }
    );
  };

  const showMembershipModal = () => {
    if (!memberships[leagueId]) return;

    const joinedAt = new Date(memberships[leagueId]?.joinedAt);
    const joinedAtFormatted = joinedAt.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    showCustom(
      <Container
        column
        centerHorizontal
        w100
        h100
        gap={gap.md}
        padding={padding}
      >
        <LeagueLogoComponent
          logo={league?.logoUrl || ""}
          name={league?.name || ""}
          style={{ width: 36, height: 36 }}
        />
        <ThemedText textStyle={TextStyle.Header}>Membership</ThemedText>
        <ThemedText textStyle={TextStyle.Body} center>
          You've been a member of this league since{" "}
          <ThemedText textStyle={TextStyle.Body} muted>
            {joinedAtFormatted}
          </ThemedText>
          .
        </ThemedText>
        <TouchableOpacity
          onPress={() => {
            // membershipService.leaveLeague(leagueId, user?.id);
            showConfirmLeaveLeagueModal();
          }}
          style={{
            padding: padding,
            borderRadius: rounding,
            backgroundColor: theme.colors.danger,
            width: "100%",
            marginTop: spacing.lg,
          }}
        >
          <ThemedText textStyle={TextStyle.BodySmall} color={"white"} center>
            Leave League
          </ThemedText>
        </TouchableOpacity>
      </Container>
    );
  };

  return (
    <ScreenContainer safeAreaColour={theme.backgroundGradient[0]}>
      <TobBar showBackButton={true}>
        {!isLoadingLeagueInfo && (
          <TouchableOpacity onPress={showMembershipModal}>
            <Card style={{ width: "auto", padding: 0 }}>
              <Container
                row
                centerVertical
                gap={gap.sm}
                paddingVertical={paddingSmall}
                paddingHorizontal={padding}
                style={{ width: "auto" }}
              >
                <Icon name="user" size={16} color={theme.colors.text} />
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  color={theme.colors.text}
                >
                  My Membership
                </ThemedText>
              </Container>
            </Card>
          </TouchableOpacity>
        )}
      </TobBar>
      <ScrollArea
        refreshAreaProps={{
          onRefresh: refresh,
          refreshing: refreshing,
        }}
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
          {!isLoadingLeagueInfo ? (
            <>
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
                  members={league?.members || []}
                  isMember={isUserMember}
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
                {nextLeagueNight && !isLeagueNightToday() && (
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
                    <ThemedText
                      textStyle={TextStyle.BodyMedium}
                      color={"white"}
                    >
                      Active now
                    </ThemedText>
                  </Container>
                )}
                {!nextLeagueNight && isLeagueNightToday() && (
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
                    <ThemedText
                      textStyle={TextStyle.BodyMedium}
                      color={"white"}
                    >
                      Today
                    </ThemedText>
                  </Container>
                )}
              </Container>
            </>
          ) : (
            <ShimmerComponent
              width="100%"
              height="100%"
              rounding={rounding}
              baseColor={SHIMMER_COLOUR}
            />
          )}
        </Container>

        {/* League Info */}
        <Container column w100 gap={gap.sm} paddingHorizontal={padding}>
          <Container column w100 gap={gap.sm}>
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
              <Container
                row
                centerVertical
                gap={gap.sm}
                style={styles.leagueNameContainer}
              >
                {!isLoadingLeagueInfo && league ? (
                  <>
                    <LeagueLogoComponent
                      logo={league?.logoUrl || ""}
                      name={league?.name || ""}
                      style={{ width: 36, height: 36 }}
                    />
                    <ThemedText
                      textStyle={TextStyle.Header}
                      style={styles.leagueNameText}
                    >
                      {hyphenateLeagueName(league?.name || "")}
                    </ThemedText>
                  </>
                ) : (
                  <>
                    <ShimmerComponent
                      width={36}
                      height={36}
                      rounding={roundingFull}
                      baseColor={SHIMMER_COLOUR}
                    />
                    <ShimmerComponent
                      width={180}
                      height={50}
                      rounding={rounding}
                      baseColor={SHIMMER_COLOUR}
                    />
                  </>
                )}
              </Container>

              {!isLoadingLeagueInfo && (
                <FavouriteButtonComponent league={league || undefined} />
              )}
            </Container>
          </Container>

          <Container row centerVertical gap={gap.sm}>
            {!isLoadingLeagueInfo ? (
              <>
                <Icon
                  name="map-pin"
                  size={16}
                  color={theme.colors.text + "60"}
                />
                <ThemedText textStyle={TextStyle.BodyMedium} muted>
                  {league?.location || ""}
                </ThemedText>
              </>
            ) : (
              <ShimmerComponent
                width={100}
                height={16}
                rounding={rounding}
                baseColor={SHIMMER_COLOUR}
              />
            )}
          </Container>

          <Container row centerVertical gap={gap.sm}>
            {!isLoadingLeagueInfo ? (
              <>
                <Icon
                  name="calendar"
                  size={16}
                  color={theme.colors.text + "60"}
                />
                <ThemedText textStyle={TextStyle.BodyMedium} muted>
                  {getLeagueDays()}
                </ThemedText>
              </>
            ) : (
              <ShimmerComponent
                width={100}
                height={16}
                rounding={rounding}
                baseColor={SHIMMER_COLOUR}
              />
            )}
          </Container>
        </Container>

        {/* Upcoming League Nights */}

        {!isLoadingLeagueInfo && league ? (
          <Container
            column
            w100
            gap={gap.sm}
            style={{
              ...(leagueNights.length === 0 && { paddingRight: padding }),
            }}
          >
            <ThemedText
              textStyle={TextStyle.Body}
              style={{ paddingLeft: padding }}
            >
              Upcoming Nights
            </ThemedText>
            <LeagueNightsComponent
              leagues={[league]}
              showLeague={false}
              leagueNights={leagueNights}
              isUserMember={isUserMember}
            />
          </Container>
        ) : (
          <Container w100 gap={gap.sm} padding={padding}>
            <ShimmerComponent
              width="100%"
              height={80}
              rounding={rounding}
              baseColor={SHIMMER_COLOUR}
            />
          </Container>
        )}

        {/* Venue Info */}
        <Container column w100 gap={gap.sm} paddingHorizontal={padding}>
          {!isLoadingLeagueInfo && league ? (
            <>
              <ThemedText textStyle={TextStyle.Body}>Venue</ThemedText>

              <Container w100>
                <MapSnapshot
                  latitude={league?.latitude || 0}
                  longitude={league?.longitude || 0}
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
                    <ThemedText
                      textStyle={TextStyle.BodyMedium}
                      color={"#dddddd"}
                    >
                      Open in {Platform.OS === "ios" ? "Maps" : "Google Maps"}
                    </ThemedText>
                  </Container>
                </TouchableOpacity>
              </Container>
            </>
          ) : (
            <ShimmerComponent
              width="100%"
              height={200}
              rounding={rounding}
              baseColor={SHIMMER_COLOUR}
            />
          )}
        </Container>
      </ScrollArea>

      {showBottomSheet && (
        <AppBottomSheet
          isOpen={true}
          showHandle={
            !!showNextNight && shouldUseCheckedInVisualState && isCheckedIn
          }
          onClose={() => {}}
          enableDynamicSizing={false}
          enableDragging={true}
          allowSwipeToClose={false}
          actionOnBackdropPress={ActionOnBackdropPress.COLLAPSE}
          snapPoints={leagueActionsSnapPoints}
          sheetIndex={leagueActionsSheetStage}
          backdropAppearsOnIndex={1}
          backdropDisappearsOnIndex={0}
          onStageChange={(stageIndex) => {
            if (stageIndex >= 0) {
              setLeagueActionsSheetStage(stageIndex);
            }
          }}
          sheetBackgroundColor={sheetBackgroundColor}
          headerContent={renderSheetHeader()}
          onHeaderLayout={(height) => {
            if (height > 0) {
              console.log("height", height);
              setLeagueActionsContentHeight(height);
            }
          }}
          contentContainerStyle={{
            width: "100%",
            flex: 1,
            flexGrow: 1,
          }}
          persistBodyContent
        >
          {renderSheetBody()}
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
});
