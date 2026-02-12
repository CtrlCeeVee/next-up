import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Container, ThemedText } from "../../../components";
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
      },
    };
  };

  return (
    <Container column w100 gap={gap.md}>
      {leagueNights.length > 0 && (
        <Container column w100>
          <ScrollView
            style={{ width: "100%" }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          >
            {leagueNights.map((night, index) => {
              const dateInfo = getDateInfo(night.date);
              return (
                <TouchableOpacity
                  key={night.id}
                  onPress={() => handleNavigateToNight(night.id)}
                  activeOpacity={0.85}
                  style={[
                    styles.carouselCard,
                    {
                      marginRight:
                        index === leagueNights.length - 1 ? 0 : gap.md,
                      backgroundColor:
                        night.status === "active"
                          ? theme.colors.primary + "10"
                          : theme.colors.background,
                      borderColor:
                        night.status === "active"
                          ? theme.colors.primary
                          : theme.colors.border,
                    },
                  ]}
                >
                  <Container row spaceBetween centerVertical>
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
                        <ThemedText textStyle={TextStyle.BodySmall} muted>
                          At {night.time}
                        </ThemedText>
                      </Container>
                      {DateUtility.isToday(night.date) && (
                        <Container
                          rounding={rounding}
                          paddingVertical={spacing.xs}
                          paddingHorizontal={spacing.md}
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
          </ScrollView>
        </Container>
      )}
      {leagueNights.length === 0 && (
        <Container column w100 centerHorizontal>
          <Icon
            name="tennis-ball"
            size={defaultIconSize}
            color={theme.colors.text + "60"}
          />
          <ThemedText textStyle={TextStyle.BodyMedium} muted>
            No upcoming league nights
          </ThemedText>
        </Container>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  carouselContent: {
    paddingRight: padding,
  },
  carouselCard: {
    width: 280,
    borderWidth: 1,
    borderRadius: rounding,
    paddingHorizontal: paddingLarge,
    paddingVertical: padding,
  },
});
