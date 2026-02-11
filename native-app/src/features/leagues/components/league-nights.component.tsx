import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Card, Container, ScrollArea, ThemedText } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { TextStyle } from "../../../core/styles/text";
import {
  padding,
  paddingLarge,
  paddingSmall,
  rounding,
  spacing,
} from "../../../core/styles";
import { gap } from "../../../core/styles";
import { LeagueNightInstance } from "../../league-nights/types";
import { Routes } from "../../../navigation/routes";
import { LeaguesStackParamList } from "../../../navigation/types";
import { DateUtility } from "../../../core/utilities";

type LeagueNightNavigationProp = NativeStackNavigationProp<
  LeaguesStackParamList,
  Routes.LeagueNight
>;

interface DateInfo {
  day: string;
  month: {
    short: string;
    long: string;
  };
}

export const LeagueNightsComponent = ({
  leagueNights,
  isUserMember,
  leagueId,
}: {
  leagueNights: LeagueNightInstance[];
  isUserMember: boolean;
  leagueId: string;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<LeagueNightNavigationProp>();

  const handleNavigateToNight = (nightId: string) => {
    navigation.navigate(Routes.LeagueNight, { leagueId, nightId });
  };

  const getDateInfo = (date: string): DateInfo => {
    const dateObj = new Date(date);
    return {
      day: dateObj.getDate().toString(),
      month: {
        short: dateObj.toLocaleString("default", { month: "short" }),
        long: dateObj.toLocaleString("default", { month: "long" }),
      },
    };
  };

  return (
    <Container column grow w100>
      {/* Upcoming League Nights */}
      {isUserMember && leagueNights.length > 0 && (
        <ScrollArea>
          <ThemedText textStyle={TextStyle.Body}>Upcoming Nights</ThemedText>

          {leagueNights.map((night) => {
            const dateInfo = getDateInfo(night.date);
            return (
              <TouchableOpacity
                key={night.id}
                onPress={() => handleNavigateToNight(night.id)}
                activeOpacity={0.7}
              >
                <Container
                  row
                  w100
                  spaceBetween
                  centerVertical
                  paddingHorizontal={paddingLarge}
                  paddingVertical={padding}
                  rounding={rounding}
                  style={{
                    backgroundColor:
                      night.status === "active"
                        ? theme.colors.primary + "10"
                        : "transparent",
                    borderColor:
                      night.status === "active"
                        ? theme.colors.primary
                        : theme.colors.border,
                    borderWidth: 1,
                  }}
                >
                  <Container row centerVertical gap={gap.lg}>
                    <Container column centerHorizontal>
                      <ThemedText textStyle={TextStyle.BodyMedium}>
                        {dateInfo.day}
                      </ThemedText>
                      <ThemedText textStyle={TextStyle.BodySmall}>
                        {dateInfo.month.short}
                      </ThemedText>
                    </Container>
                    <Container column>
                      <ThemedText textStyle={TextStyle.BodyMedium}>
                        {night.day}
                      </ThemedText>
                      <ThemedText textStyle={TextStyle.BodySmall}>
                        At {night.time}
                      </ThemedText>
                    </Container>
                    {DateUtility.isToday(night.date) && (
                      <Container
                        paddingVertical={spacing.xs}
                        paddingHorizontal={spacing.md}
                        rounding={rounding}
                        style={{
                          backgroundColor: theme.colors.primary,
                        }}
                      >
                        <ThemedText textStyle={TextStyle.BodySmall}>
                          Today
                        </ThemedText>
                      </Container>
                    )}
                  </Container>
                  <Icon
                    name="chevron-right"
                    size={20}
                    color={theme.colors.text + "60"}
                  />
                </Container>
              </TouchableOpacity>
            );
          })}
        </ScrollArea>
      )}
    </Container>
  );
};
