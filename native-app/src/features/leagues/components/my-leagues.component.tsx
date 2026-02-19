import { Button, Card, Container, ThemedText } from "../../../components";
import {
  defaultIconSize,
  gap,
  padding,
  paddingLarge,
  paddingSmall,
  rounding,
  roundingFull,
  roundingMedium,
  roundingSmall,
  TextStyle,
} from "../../../core/styles";
import { League } from "../types";
import { LeagueLogoComponent } from "./league-logo.component";
import { useTheme } from "../../../core/theme";
import {
  LayoutChangeEvent,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { SelectedIcon } from "../../../icons/selected-icon.component";
import { Icon } from "../../../icons/icon.component";
import { IconName } from "../../../icons";
import { BadgeComponent } from "../../../components/badge.component";
import {
  LeagueDaysSummary,
  LeagueDaysComponentSize,
} from "./league-days-summary.component";
import { HapticWrapper } from "../../../components/haptic-wrapper.component";
import { Routes } from "../../../navigation/routes";
import { useNavigation } from "@react-navigation/native";
import { AppTabParamList } from "../../../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { usePopover } from "../../../components/popover";

interface Position {
  x: number;
  y: number;
}

interface BadgeDetails {
  name: IconName;
  description: string;
  color: string;
}

const SELECTED_ICON_Y_TRANSFORM = 0;
const MINI_ICON_SIZE = 12;
const MINI_ICON_PADDING = 4;
const MINI_ICON_TOTAL_SIZE = MINI_ICON_SIZE + MINI_ICON_PADDING * 2;
const LOGO_SIZE = 52;
const LOGO_INNER_PADDING = 2;
const SELECTED_LEAGUE_ROUNDING = rounding;

type NavigationProp = BottomTabNavigationProp<AppTabParamList>;

export const MyLeagues = ({
  leagues,
  favouriteLeagueIds,
}: {
  leagues: League[];
  favouriteLeagueIds: string[];
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { showPopover } = usePopover();

  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  const [logoLayouts, setLogoLayouts] = useState<{
    [leagueId: string]: {
      width: number;
      height: number;
      left: number;
      top: number;
    };
  }>({});

  const selectedBackgroundColor = theme.colors.primary; // "#00423b80";

  // Store animated values for each league
  const animatedValues = useRef<{
    [leagueId: string]: Animated.Value;
  }>({});

  // Animated values for indicator position
  const indicatorTop = useRef(new Animated.Value(0)).current;
  const indicatorLeft = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const indicatorHeight = useRef(new Animated.Value(0)).current;

  // Initialize animated value for a league if it doesn't exist
  const getAnimatedValue = (leagueId: string): Animated.Value => {
    if (!animatedValues.current[leagueId]) {
      animatedValues.current[leagueId] = new Animated.Value(0);
    }
    return animatedValues.current[leagueId];
  };

  const handleSelectLeague = (league: League) => {
    navigateToLeague(league);
  };

  const navigateToLeague = (league: League) => {
    navigation.navigate(Routes.Leagues, {
      screen: Routes.LeagueDetail,
      params: { leagueId: league.id },
    });
  };

  const handleLayout = (leagueId: string, event: LayoutChangeEvent) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    setLogoLayouts((prev) => {
      const newLayouts = { ...prev };
      newLayouts[leagueId] = { width, height, left: x, top: y };

      let currentSelectedLeague = selectedLeague;
      if (leagues.length > 0 && !currentSelectedLeague) {
        currentSelectedLeague = leagues[0];
      }

      // If this is the currently selected league, update indicator position
      if (currentSelectedLeague?.id === leagueId) {
        Animated.parallel([
          Animated.spring(indicatorTop, {
            toValue: y,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(indicatorLeft, {
            toValue: x,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(indicatorWidth, {
            toValue: width,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(indicatorHeight, {
            toValue: height,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }),
        ]).start();
      }

      return newLayouts;
    });
  };

  // Initialize animated values for all leagues on mount
  useEffect(() => {
    let currentSelectedLeague = selectedLeague;
    if (leagues.length > 0 && !currentSelectedLeague) {
      currentSelectedLeague = leagues[0];
    }

    leagues.forEach((league) => {
      const animatedValue = getAnimatedValue(league.id);
      // Set initial value based on current selection
      animatedValue.setValue(
        currentSelectedLeague?.id === league.id ? SELECTED_ICON_Y_TRANSFORM : 0
      );
    });

    // Initialize indicator position if a league is already selected
    if (currentSelectedLeague) {
      const layout = logoLayouts[currentSelectedLeague.id];
      if (layout) {
        indicatorTop.setValue(layout.top);
        indicatorLeft.setValue(layout.left);
        indicatorWidth.setValue(layout.width);
        indicatorHeight.setValue(layout.height);
      }
    }
  }, []);

  const isFavourited = (leagueId: string) => {
    return favouriteLeagueIds.includes(leagueId);
  };

  const isTonight = true;

  const calculatePositionOnCircumference = (index: number): Position => {
    const startingAngle = -67.5 * (Math.PI / 180);

    const iconGap = 5;

    const radius = LOGO_SIZE / 2;
    const circumference = 2 * Math.PI * radius;

    const lMin = 0;
    const lMax = circumference;

    const centerX = radius;
    const centerY = radius;

    const lCoord = index * (MINI_ICON_TOTAL_SIZE + iconGap);

    const p = (lCoord - lMin) / (lMax - lMin);
    const angle = startingAngle + p * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  const getBadges = (league: League) => {
    const icons: BadgeDetails[] = [];
    if (isFavourited(league.id)) {
      icons.push({
        name: "heart" as IconName,
        description: "Favourited",
        color: theme.colors.primaryDark,
      });
    }
    if (isTonight) {
      icons.push({
        name: "moon" as IconName,
        description: "Tonight",
        color: theme.colors.accent,
      });
    }
    return icons;
  };

  const renderIcons = (league: League) => {
    const icons: BadgeDetails[] = getBadges(league);

    return (
      <>
        {icons.map((icon, index) => {
          const position = calculatePositionOnCircumference(index);
          return (
            <Container
              // stop interaction with the icon
              key={icon.name}
              padding={MINI_ICON_PADDING}
              style={{
                position: "absolute",
                top: position.y + LOGO_INNER_PADDING / 2,
                left: position.x + LOGO_INNER_PADDING / 2,
                zIndex: 4,
                transform: [{ translateY: "-50%" }, { translateX: "-50%" }],
                backgroundColor: theme.colors.cardColour,
                borderRadius: roundingFull,
                pointerEvents: "none",
                borderWidth: 1,
                borderColor: icon.color,
              }}
            >
              <Icon name={icon.name} size={MINI_ICON_SIZE} color={icon.color} />
            </Container>
          );
        })}
      </>
    );
  };

  const renderBadges = (league: League) => {
    const badges: BadgeDetails[] = getBadges(league);
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 1 }}
      >
        {badges.map((badge) => {
          return (
            <BadgeComponent
              key={badge.name}
              icon={badge.name}
              text={badge.description}
              color={badge.color}
              // color={"white"}
              style={{
                borderWidth: 1,
                borderColor: badge.color,
                marginRight: gap.sm,
                // backgroundColor: "#ffffffCC",
              }}
            />
          );
        })}
      </ScrollView>
    );
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").slice(0, 2);
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const summarizeLeagueName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const renderJoinMoreLeagues = () => {
    return (
      <TouchableOpacity onPress={navigateToBrowseLeagues}>
        <Container
          row
          centerHorizontal
          centerVertical
          gap={gap.sm}
          style={{
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            backgroundColor: theme.colors.primary + "40",
            borderRadius: roundingFull,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            borderStyle: "dashed",
          }}
        >
          <Icon name="plus" size={36} color={theme.colors.primary} />
        </Container>
      </TouchableOpacity>
    );
  };

  const navigateToBrowseLeagues = () => {
    navigation.navigate(Routes.Leagues, {
      screen: Routes.BrowseLeagues,
    });
  };

  return (
    // <Card>
    <Container column w100 gap={0}>
      {/* paddingHorizontal is set to rounding to ensure the card is not cut off */}
      <Container
        row
        paddingHorizontal={paddingSmall}
        paddingVertical={paddingSmall}
        w100
      >
        {/* League icons */}

        <ScrollView
          style={{ width: "100%", overflow: "visible" }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: gap.xl }}
        >
          {/* {selectedLeague && (
            <Animated.View
              style={{
                position: "absolute",
                marginTop: SELECTED_ICON_Y_TRANSFORM,
                marginLeft: 0,
                top: indicatorTop,
                left: indicatorLeft,
                width: indicatorWidth,
                height: indicatorHeight,
                zIndex: 0,
                backgroundColor: selectedBackgroundColor,
                borderColor: selectedBackgroundColor,
                borderRadius: roundingFull,
              }}
            >
              <SelectedIcon
                  size={LOGO_SIZE}
                  color={selectedBackgroundColor}
                />
            </Animated.View>
          )} */}
          {leagues.map((league) => {
            const animatedValue = getAnimatedValue(league.id);
            return (
              <Animated.View
                key={league.id}
                style={{
                  transform: [{ translateY: animatedValue }],
                  width: LOGO_SIZE,
                  height: LOGO_SIZE,
                }}
                onLayout={(event) => handleLayout(league.id, event)}
              >
                <HapticWrapper onPress={() => handleSelectLeague(league)}>
                  <Container column gap={gap.sm} centerHorizontal>
                    <Container
                      style={{ width: "100%", zIndex: 1 }}
                      padding={LOGO_INNER_PADDING}
                    >
                      {renderIcons(league)}
                      <LeagueLogoComponent
                        logo={league.logoUrl}
                        name={league.name}
                        width={LOGO_SIZE - LOGO_INNER_PADDING * 2}
                        height={LOGO_SIZE - LOGO_INNER_PADDING * 2}
                      />
                    </Container>

                    <ThemedText textStyle={TextStyle.BodySmall} center>
                      {summarizeLeagueName(league.name)}
                    </ThemedText>
                  </Container>
                </HapticWrapper>
              </Animated.View>
            );
          })}

          {renderJoinMoreLeagues()}
        </ScrollView>
      </Container>
    </Container>
    // </Card>
  );
};
