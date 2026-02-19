import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText, Card, Container, LazyImage } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import {
  TextStyle,
  spacing,
  gap,
  roundingFull,
  roundingSmall,
  paddingSmall,
  paddingXSmall,
  rounding,
  padding,
  roundingMedium,
} from "../../../core/styles";
import { BadgeComponent } from "../../../components/badge.component";
import { League } from "../types";
import { LeagueDaysSummary } from "./league-days-summary.component";
import { FavouriteButtonComponent } from "../../../components/favourite-button.component";
import { LinearGradient } from "expo-linear-gradient";
import { LeagueMembersComponent } from "./league-members.component";
import { LeagueLogoComponent } from "./league-logo.component";

interface LeagueCardProps {
  league: League;
  isTonight: boolean;
  isMember: boolean;
  onPress: () => void;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({
  league,
  isTonight,
  isMember,
  onPress,
}) => {
  const { theme } = useTheme();

  const renderChevron = () => {
    return (
      <View
        style={[
          styles.chevronCircle,
          { backgroundColor: theme.colors.text + "15" },
        ]}
      >
        <Icon name="chevron-right" size={18} color={theme.colors.text} />
      </View>
    );
  };

  const renderBadges = () => {
    return (
      <Container row centerVertical startHorizontal>
        {isMember && (
          <BadgeComponent
            icon="check-circle"
            text="Member"
            color={theme.colors.success}
          />
        )}
        {isTonight && (
          <BadgeComponent
            icon="moon"
            text="Tonight"
            color={theme.colors.accent}
          />
        )}
        {!isTonight && (
          <BadgeComponent
            icon="moon"
            text="Not tonight"
            color={theme.colors.muted}
          />
        )}
      </Container>
    );
  };

  return (
    <TouchableOpacity onPress={onPress} style={{ width: "100%" }}>
      <Card style={styles.leagueCard} variant="elevated">
        {/* <Container
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 0,
            width: "30%",
            height: "50%",
          }}
        >
          <LinearGradient
            colors={[theme.colors.cardColour, "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
            }}
          />
          <LazyImage
            source={{
              uri:
                league.image ||
                "https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2024/07/1200/675/pickleball-paddle-court.jpg?ve=1&tl=1",
            }}
            style={{
              zIndex: 1,
            }}
            width="100%"
            height="100%"
          />
        </Container> */}

        <Container
          column
          spaceBetween
          paddingHorizontal={padding}
          paddingVertical={padding}
          gap={gap.md}
        >
          <Container row spaceBetween startVertical gap={gap.xs}>
            <Container column grow gap={gap.sm}>
              <Container row centerVertical startHorizontal>
                {renderBadges()}
              </Container>
              <Container row w100 gap={gap.sm}>
                <LeagueLogoComponent
                  logo={league.logoUrl}
                  name={league.name}
                  width={40}
                  height={40}
                  rounding={roundingFull}
                />
                <Container column style={{ flexGrow: 1 }}>
                  <ThemedText textStyle={TextStyle.BodyMedium}>
                    {league.name}
                  </ThemedText>
                  {league.location && (
                    <Container row startVertical gap={gap.xs} w100>
                      <ThemedText
                        textStyle={TextStyle.BodySmall}
                        startVertical
                        muted
                        grow
                        wrap
                      >
                        {league.location}
                      </ThemedText>
                    </Container>
                  )}
                </Container>
              </Container>
            </Container>

            {renderChevron()}
          </Container>

          <Container row endVertical w100 spaceBetween>
            <Container column startHorizontal>
              <Container row centerVertical endHorizontal gap={gap.xs}>
                <ThemedText textStyle={TextStyle.BodySmall}>
                  12 Jun 19:00
                </ThemedText>
              </Container>
              <ThemedText textStyle={TextStyle.BodySmall} muted>
                Next Up
              </ThemedText>
            </Container>
            <Container
              column
              startHorizontal
              style={{
                position: "absolute",
                left: "50%",
                transform: [{ translateX: "-50%" }],
              }}
            >
              <LeagueDaysSummary leagueDays={league.leagueDays} />
            </Container>
            <Container column endHorizontal>
              <Container row centerVertical endHorizontal gap={gap.xs}>
                <Icon name="users" size={12} color={theme.colors.text + "60"} />
                <ThemedText textStyle={TextStyle.BodySmall}>
                  {league.totalPlayers}
                </ThemedText>
              </Container>
              <ThemedText textStyle={TextStyle.BodySmall} muted>
                Members
              </ThemedText>
            </Container>
          </Container>
        </Container>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  leagueCard: {
    marginBottom: spacing.lg,
    gap: gap.xs,
    width: "100%",
    padding: 0,
    borderRadius: rounding,
  },
  chevronCircle: {
    width: 26,
    height: 26,
    borderRadius: roundingFull,
    justifyContent: "center",
    alignItems: "center",
  },
});
