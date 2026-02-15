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
import { LeagueDaysSummary } from "./league-days-summary.component";
import { HapticWrapper } from "../../../components/haptic-wrapper.component";
import { Routes } from "../../../navigation/routes";
import { useNavigation } from "@react-navigation/native";
import { AppTabParamList } from "../../../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

interface Position {
  x: number;
  y: number;
}

interface BadgeDetails {
  name: IconName;
  description: string;
  color: string;
}

const SELECTED_ICON_Y_TRANSFORM = 10;
const MINI_ICON_SIZE = 12;
const MINI_ICON_PADDING = 4;
const MINI_ICON_TOTAL_SIZE = MINI_ICON_SIZE + MINI_ICON_PADDING * 2;
const LOGO_SIZE = 52;
const LOGO_INNER_PADDING = 4;

type NavigationProp = BottomTabNavigationProp<AppTabParamList>;

export const MyLeagues = ({ leagues }: { leagues: League[] }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

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
    setSelectedLeague(league);

    // Animate all leagues
    leagues.forEach((l) => {
      const animatedValue = getAnimatedValue(l.id);
      const isSelected = l.id === league.id;
      const targetValue = isSelected ? SELECTED_ICON_Y_TRANSFORM : 0;

      Animated.spring(animatedValue, {
        toValue: targetValue,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    });

    // Animate indicator position
    const layout = logoLayouts[league.id];
    if (layout) {
      Animated.parallel([
        Animated.spring(indicatorTop, {
          toValue: layout.top,
          useNativeDriver: false, // position animations can't use native driver
          tension: 100,
          friction: 8,
        }),
        Animated.spring(indicatorLeft, {
          toValue: layout.left,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(indicatorWidth, {
          toValue: layout.width,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(indicatorHeight, {
          toValue: layout.height,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
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

      // If this is the currently selected league, update indicator position
      if (selectedLeague?.id === leagueId) {
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

  useEffect(() => {
    if (leagues.length > 0 && !selectedLeague) {
      handleSelectLeague(leagues[0]);
    }
  }, [leagues]);

  // Initialize animated values for all leagues on mount
  useEffect(() => {
    leagues.forEach((league) => {
      const animatedValue = getAnimatedValue(league.id);
      // Set initial value based on current selection
      animatedValue.setValue(
        selectedLeague?.id === league.id ? SELECTED_ICON_Y_TRANSFORM : 0
      );
    });

    // Initialize indicator position if a league is already selected
    if (selectedLeague) {
      const layout = logoLayouts[selectedLeague.id];
      if (layout) {
        indicatorTop.setValue(layout.top);
        indicatorLeft.setValue(layout.left);
        indicatorWidth.setValue(layout.width);
        indicatorHeight.setValue(layout.height);
      }
    }
  }, []);

  const isFavourited = true;
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
    if (isFavourited) {
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

  return (
    <Card>
      <Container column w100 gap={0}>
        {/* paddingHorizontal is set to rounding to ensure the card is not cut off */}
        <Container row paddingHorizontal={roundingMedium} w100>
          {/* League icons */}

          <ScrollView
            style={{ width: "100%", overflow: "visible" }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: gap.md }}
          >
            {selectedLeague && (
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
                {/* <Container
                  style={{
                    backgroundColor: selectedBackgroundColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  rounding={roundingFull}
                > */}
                <SelectedIcon
                  size={LOGO_SIZE}
                  color={selectedBackgroundColor}
                />
                {/* </Container> */}
              </Animated.View>
            )}
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
                    <Container
                      style={{ width: "100%", height: "100%", zIndex: 1 }}
                      padding={LOGO_INNER_PADDING}
                    >
                      {renderIcons(league)}
                      <LeagueLogoComponent
                        // logo={league.logo}
                        logo="https://static.vecteezy.com/ti/vetor-gratis/p1/36489045-aguia-cabeca-logotipo-modelo-icone-ilustracao-projeto-para-o-negocio-e-corporativo-vetor.jpg"
                        name={league.name}
                        width={LOGO_SIZE - LOGO_INNER_PADDING * 2}
                        height={LOGO_SIZE - LOGO_INNER_PADDING * 2}
                      />
                    </Container>
                  </HapticWrapper>
                </Animated.View>
              );
            })}
          </ScrollView>
        </Container>

        {selectedLeague && (
          <Card
            style={{
              borderRadius: roundingMedium,
              borderWidth: 1,
              borderColor: selectedBackgroundColor,
              marginTop: SELECTED_ICON_Y_TRANSFORM,
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => navigateToLeague(selectedLeague)}
              style={{ width: "100%" }}
            >
              <Container
                row
                // padding={padding}
                rounding={roundingMedium}
                style={{
                  alignItems: "stretch",
                  // backgroundColor: theme.colors.cardColour,
                }}
                w100
              >
                <Container column style={{ flex: 1, minWidth: 0 }}>
                  <Container column gap={gap.md} w100>
                    <Container row spaceBetween w100>
                      {selectedLeague && renderBadges(selectedLeague)}
                      <Icon
                        name="chevron-right"
                        size={defaultIconSize}
                        color={theme.colors.text}
                      />
                    </Container>
                    <Container row startVertical w100 gap={gap.sm}>
                      <LeagueLogoComponent
                        // logo={league.logo}
                        logo="https://static.vecteezy.com/ti/vetor-gratis/p1/36489045-aguia-cabeca-logotipo-modelo-icone-ilustracao-projeto-para-o-negocio-e-corporativo-vetor.jpg"
                        name={selectedLeague?.name || ""}
                        style={{ marginTop: gap.xs }}
                      />
                      <Container column gap={gap.md} style={{ flexGrow: 1 }}>
                        <Container column gap={gap.xs} w100>
                          <ThemedText textStyle={TextStyle.Body}>
                            {selectedLeague?.name}
                          </ThemedText>
                          <ThemedText textStyle={TextStyle.BodySmall} muted>
                            {selectedLeague?.location}
                          </ThemedText>
                        </Container>

                        {/* <ThemedText textStyle={TextStyle.BodySmall}>
                    {getLeagueDays(selectedLeague)}
                  </ThemedText> */}

                        <LeagueDaysSummary
                          leagueDays={selectedLeague?.leagueDays || []}
                          todayColour={theme.colors.accent}
                          activeColour={"white"}
                          inactiveColour={"#ffffff90"}
                        />
                      </Container>
                    </Container>
                  </Container>
                </Container>

                <Container
                  column
                  spaceBetween
                  endHorizontal
                  style={{ alignSelf: "stretch", flexShrink: 0 }}
                ></Container>
              </Container>
            </TouchableOpacity>
          </Card>
        )}
      </Container>
    </Card>
  );
};
