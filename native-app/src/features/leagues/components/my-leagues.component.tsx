import { Card, Container, ThemedText } from "../../../components";
import {
  defaultIconSize,
  gap,
  padding,
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
import { LayoutChangeEvent, ScrollView, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { SelectedIcon } from "../../../icons/selected-icon.component";
import { Icon } from "../../../icons/icon.component";
import { IconName } from "../../../icons";

interface Position {
  x: number;
  y: number;
}

interface CircumferenceIcon {
  name: IconName;
  color: string;
}

export const MyLeagues = ({ leagues }: { leagues: League[] }) => {
  const { theme } = useTheme();

  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  const [logoLayouts, setLogoLayouts] = useState<{
    [leagueId: string]: {
      width: number;
      height: number;
      left: number;
      top: number;
    };
  }>({});

  const selectedTransformationValue = 10;
  const selectedBackgroundColor = theme.colors.primary;

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
    console.log("selected league", league);
    const previousSelected = selectedLeague;
    setSelectedLeague(league);

    // Animate all leagues
    leagues.forEach((l) => {
      const animatedValue = getAnimatedValue(l.id);
      const isSelected = l.id === league.id;
      const targetValue = isSelected ? selectedTransformationValue : 0;

      Animated.spring(animatedValue, {
        toValue: targetValue,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    });

    // Animate indicator position
    const layout = logoLayouts[league.id];
    console.log("layout", layout);
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

  const handleLayout = (leagueId: string, event: LayoutChangeEvent) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    console.log("league id", leagueId);
    setLogoLayouts((prev) => {
      const newLayouts = { ...prev };
      newLayouts[leagueId] = { width, height, left: x, top: y };
      console.log("selected league layouts", newLayouts);

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

  const isSelected = (leagueId: string) => {
    return selectedLeague?.id === leagueId;
  };

  // Initialize animated values for all leagues on mount
  useEffect(() => {
    leagues.forEach((league) => {
      const animatedValue = getAnimatedValue(league.id);
      // Set initial value based on current selection
      animatedValue.setValue(
        selectedLeague?.id === league.id ? selectedTransformationValue : 0
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

  const getLeagueDays = (league: League | null) => {
    if (!league) return "Unknown schedule";

    const days = league.leagueDays;
    if (days.length === 0) {
      return "Unknown schedule";
    }
    if (days.length === 1) return "Plays on " + days[0] + "s";
    if (days.length === 2) return "Plays on " + days.join("s and ") + "s";
    return (
      "Plays on " +
      days.splice(0, days.length - 1).join(", ") +
      "s and " +
      days[days.length - 1] +
      "s"
    );
  };

  const isFavourited = true;
  const isTonight = true;
  const miniIconSize = 12;
  const miniIconPadding = 4;
  const miniIconTotalSize = miniIconSize + miniIconPadding * 2;

  const calculatePositionOnCircumference = (index: number): Position => {
    // const angle = (index / total) * 2 * Math.PI;
    // const x = Math.cos(angle) * miniIconTotalSize;
    // const y = Math.sin(angle) * miniIconTotalSize;
    // return { x, y };

    const startingAngle = -67.5 * (Math.PI / 180);

    const iconGap = 3;

    const radius = logoSize / 2;
    const circumference = 2 * Math.PI * radius;

    const lMin = 0;
    const lMax = circumference;

    const centerX = radius;
    const centerY = radius;

    const lCoord = index * (miniIconTotalSize + iconGap);

    const p = (lCoord - lMin) / (lMax - lMin);
    const angle = startingAngle + p * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  const getIconsToRender = (league: League) => {
    const icons: CircumferenceIcon[] = [];
    if (isFavourited) {
      icons.push({
        name: "heart" as IconName,
        color: theme.colors.text,
      });
    }
    if (isTonight) {
      icons.push({
        name: "moon" as IconName,
        color: theme.colors.accent,
      });
    }
    return icons;
  };

  const renderIcons = (league: League) => {
    const icons: CircumferenceIcon[] = getIconsToRender(league);

    return (
      <>
        {icons.map((icon, index) => {
          const position = calculatePositionOnCircumference(index);
          return (
            <Container
              // stop interaction with the icon
              key={icon.name}
              padding={miniIconPadding}
              style={{
                position: "absolute",
                top: position.y + logoInnerPadding / 2,
                left: position.x + logoInnerPadding / 2,
                zIndex: 4,
                transform: [{ translateY: "-50%" }, { translateX: "-50%" }],
                backgroundColor: theme.colors.cardColour,
                borderRadius: roundingFull,
                pointerEvents: "none",
              }}
            >
              <Icon name={icon.name} size={miniIconSize} color={icon.color} />
            </Container>
          );
        })}
      </>
    );

    // return (
    //   <>
    //     {isFavourited && (
    //       <Container
    //         padding={4}
    //         rounding={roundingFull}
    //         style={{
    //           position: "absolute",
    //           top: -4,
    //           right: -4,
    //           zIndex: 2,
    //           backgroundColor: theme.colors.cardColour,
    //         }}
    //       >
    //         <Icon name="heart" size={12} color={theme.colors.text} />
    //       </Container>
    //     )}

    //     {isTonight && (
    //       <Container
    //         padding={4}
    //         rounding={roundingFull}
    //         style={{
    //           position: "absolute",
    //           top: 12,
    //           right: -12,
    //           zIndex: 2,
    //           backgroundColor: theme.colors.cardColour,
    //         }}
    //       >
    //         <Icon name="moon" size={12} color={theme.colors.accent} />
    //       </Container>
    //     )}
    //   </>
    // );
  };

  const logoInnerPadding = 4;
  const indicatorColor = theme.colors.primary;
  const logoSize = 44;

  return (
    <Card>
      <Container column w100 gap={0}>
        <Container row paddingHorizontal={padding} w100>
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
                  marginTop: selectedTransformationValue + logoInnerPadding / 2,
                  marginLeft: logoInnerPadding / 2,
                  top: indicatorTop,
                  left: indicatorLeft,
                  width: indicatorWidth,
                  height: indicatorHeight,
                  zIndex: 0,
                  backgroundColor: indicatorColor,
                  borderColor: indicatorColor,
                  borderRadius: roundingFull,
                }}
              >
                <Container
                  style={{
                    backgroundColor: indicatorColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  rounding={roundingFull}
                >
                  <SelectedIcon
                    size={logoSize}
                    color={selectedBackgroundColor}
                  />
                </Container>
              </Animated.View>
            )}
            {leagues.map((league) => {
              const animatedValue = getAnimatedValue(league.id);
              return (
                <Animated.View
                  key={league.id}
                  style={{
                    transform: [{ translateY: animatedValue }],
                  }}
                  onLayout={(event) => handleLayout(league.id, event)}
                >
                  <Container
                    style={{ width: logoSize, height: logoSize, zIndex: 1 }}
                    padding={logoInnerPadding}
                  >
                    {renderIcons(league)}
                    <LeagueLogoComponent
                      logo={league.logo}
                      name={league.name}
                      onPress={() => handleSelectLeague(league)}
                    />
                  </Container>
                </Animated.View>
              );
            })}
          </ScrollView>
        </Container>

        <Container
          row
          padding={padding}
          rounding={roundingMedium}
          style={{
            marginTop: selectedTransformationValue + logoInnerPadding / 2,
            backgroundColor: selectedBackgroundColor,
          }}
          w100
        >
          <Container column style={{ flexGrow: 1 }}>
            <Container column gap={gap.xs}>
              <ThemedText textStyle={TextStyle.Body}>
                {selectedLeague?.name}
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodySmall}>
                {selectedLeague?.location}
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodySmall}>
                {getLeagueDays(selectedLeague)}
              </ThemedText>
            </Container>
          </Container>
          <Icon
            name="chevron-right"
            size={defaultIconSize}
            color={theme.colors.text}
          />
        </Container>
      </Container>
    </Card>
  );
};
