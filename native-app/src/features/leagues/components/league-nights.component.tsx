import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Card, Container, ThemedText } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { TextStyle } from "../../../core/styles/text";
import {
  defaultIconSize,
  padding,
  paddingLarge,
  rounding,
  spacing,
} from "../../../core/styles";
import { gap } from "../../../core/styles";
import { LeagueNightInstance } from "../../league-nights/types";
import { Routes } from "../../../navigation/routes";
import { LeaguesStackParamList } from "../../../navigation/types";
import { DateUtility } from "../../../core/utilities";
import { League } from "../../leagues/types";
import { LeagueLogoComponent } from "./league-logo.component";

type LeagueNightNavigationProp = NativeStackNavigationProp<
  LeaguesStackParamList,
  Routes.LeagueNight
>;

interface DateInfo {
  day: string;
  month: {
    short: string;
  };
}

const RandomNoLeagueNightSentence = [
  "Stay home and watch some pickleball!",
  "Stay home and enjoy a nice cup of tea!",
  "Rest up before your next league night!",
];

export const LeagueNightsComponent = ({
  leagues,
  leagueNights,
  isUserMember,
  onLeagueNightPress,
  showLeague = false,
}: {
  leagues: League[];
  leagueNights: LeagueNightInstance[];
  isUserMember: boolean;
  onLeagueNightPress?: (night: LeagueNightInstance) => void;
  showLeague?: boolean;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<LeagueNightNavigationProp>();

  const getDateInfo = (date: string): DateInfo => {
    const dateObj = new Date(date);
    return {
      day: dateObj.getDate().toString(),
      month: {
        short: dateObj.toLocaleString("default", { month: "short" }),
      },
    };
  };

  const getRandomNoLeagueNightSentence = () => {
    return RandomNoLeagueNightSentence[
      Math.floor(Math.random() * RandomNoLeagueNightSentence.length)
    ];
  };

  const renderLeagueNightCardContent = (night: LeagueNightInstance) => {
    const dateInfo = getDateInfo(night.date);

    return (
      <Card style={{ width: "100%" }}>
        <Container column w100>
          <Container row spaceBetween centerVertical w100 wrap>
            <Container row centerVertical>
              <Container row centerVertical gap={gap.md}>
                <Container
                  column
                  centerHorizontal
                  paddingVertical={spacing.xs}
                  paddingHorizontal={spacing.sm}
                  rounding={rounding}
                >
                  <ThemedText textStyle={TextStyle.BodyMedium}>
                    {dateInfo.day}
                  </ThemedText>
                  <ThemedText textStyle={TextStyle.BodySmall}>
                    {dateInfo.month.short}
                  </ThemedText>
                </Container>
                <Container column gap={gap.xs}>
                  <ThemedText textStyle={TextStyle.BodyMedium}>
                    {night.day}
                  </ThemedText>
                  {showLeague && leagues.length > 0 && (
                    <Container row centerVertical gap={gap.sm}>
                      <ThemedText textStyle={TextStyle.BodySmall} muted>
                        {leagues.find((l) => l.id === night.leagueId)?.name ||
                          ""}
                      </ThemedText>
                    </Container>
                  )}
                  <ThemedText textStyle={TextStyle.BodySmall} muted>
                    At {night.time}
                  </ThemedText>
                </Container>
              </Container>
            </Container>
            <Container row centerVertical>
              {DateUtility.isToday(leagueNights[0].date) && (
                <Container
                  rounding={rounding}
                  paddingVertical={spacing.xs}
                  paddingHorizontal={spacing.md}
                  style={{
                    backgroundColor: theme.colors.accent,
                  }}
                >
                  <ThemedText textStyle={TextStyle.BodySmall}>
                    Tonight
                  </ThemedText>
                </Container>
              )}
              {onLeagueNightPress && (
                <Icon
                  name="chevron-right"
                  size={20}
                  color={theme.colors.text + "60"}
                />
              )}
            </Container>
          </Container>
        </Container>
      </Card>
    );
  };

  const renderLeagueNightCard = (
    night: LeagueNightInstance,
    fillWidth: boolean,
    index: number
  ) => {
    if (onLeagueNightPress) {
      return (
        <TouchableOpacity
          onPress={() => onLeagueNightPress(night)}
          activeOpacity={0.85}
          style={{
            width: fillWidth ? "100%" : 280,
            marginRight: fillWidth
              ? 0
              : index === leagueNights.length - 1
                ? 0
                : gap.md,
          }}
        >
          {renderLeagueNightCardContent(night)}
        </TouchableOpacity>
      );
    } else {
      return (
        <Container
          style={{
            width: fillWidth ? "100%" : 280,
            marginRight: fillWidth
              ? 0
              : index === leagueNights.length - 1
                ? 0
                : gap.md,
          }}
        >
          {renderLeagueNightCardContent(night)}
        </Container>
      );
    }
  };

  return (
    <Container column w100 gap={gap.md}>
      {leagueNights.length > 0 && (
        <Container column w100>
          {leagueNights.length === 1 ? (
            renderLeagueNightCard(leagueNights[0], true, 0)
          ) : (
            <ScrollView
              style={{ width: "100%" }}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            >
              {leagueNights.map((night, index) =>
                renderLeagueNightCard(night, false, index)
              )}
            </ScrollView>
          )}
        </Container>
      )}
      {leagueNights.length === 0 && (
        <Card>
          <Container column w100 centerHorizontal>
            <Icon
              name="tennis-ball"
              size={defaultIconSize}
              color={theme.colors.text + "60"}
            />
            <ThemedText textStyle={TextStyle.BodyMedium} muted>
              No upcoming league nights
            </ThemedText>
            <ThemedText textStyle={TextStyle.BodySmall} muted>
              {getRandomNoLeagueNightSentence()}
            </ThemedText>
          </Container>
        </Card>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  carouselContent: {
    paddingRight: padding,
  },
  carouselCard: {
    // width: 280,
  },
});
