import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Card, ThemedText } from "../../../components";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { TextStyle } from "../../../core/styles/text";
import { padding, rounding, spacing } from "../../../core/styles";
import { gap } from "../../../core/styles";
import { LeagueNightInstance } from "../../league-nights/types";
import { Routes } from "../../../navigation/routes";
import { LeaguesStackParamList } from "../../../navigation/types";

type LeagueNightNavigationProp = NativeStackNavigationProp<
  LeaguesStackParamList,
  Routes.LeagueNight
>;

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

  return (
    <View style={styles.container}>
      {/* Upcoming League Nights */}
      {isUserMember && leagueNights.length > 0 && (
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="calendar" size={20} color={theme.colors.primary} />
            <ThemedText textStyle={TextStyle.Subheader}>
              Upcoming Nights
            </ThemedText>
          </View>
          {leagueNights.map((night) => (
            <TouchableOpacity
              key={night.id}
              style={[
                styles.nightCard,
                {
                  backgroundColor:
                    night.status === "active"
                      ? theme.colors.primary + "10"
                      : "transparent",
                  borderColor:
                    night.status === "active"
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
              onPress={() => handleNavigateToNight(night.id)}
              activeOpacity={0.7}
            >
              <View style={styles.nightInfo}>
                <View style={styles.nightDay}>
                  <ThemedText
                    textStyle={TextStyle.Body}
                    style={styles.nightDayText}
                  >
                    {night.day}
                  </ThemedText>
                  {night.status === "active" && (
                    <View
                      style={[
                        styles.todayBadge,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <ThemedText
                        textStyle={TextStyle.BodySmall}
                        style={styles.todayBadgeText}
                      >
                        Today
                      </ThemedText>
                    </View>
                  )}
                </View>
                <View style={styles.nightDetails}>
                  <Icon
                    name="calendar"
                    size={14}
                    color={theme.colors.text + "80"}
                  />
                  <ThemedText
                    textStyle={TextStyle.BodySmall}
                    style={styles.nightDetailText}
                  >
                    {night.date}
                  </ThemedText>
                  <Icon
                    name="clock"
                    size={14}
                    color={theme.colors.text + "80"}
                  />
                  <ThemedText
                    textStyle={TextStyle.BodySmall}
                    style={styles.nightDetailText}
                  >
                    {night.time}
                  </ThemedText>
                </View>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={theme.colors.text + "60"}
              />
            </TouchableOpacity>
          ))}
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionCard: {
    padding: padding,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
  },
  nightCard: {
    padding: padding,
    borderRadius: rounding,
    borderWidth: 1,
  },
  nightInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
  },
  nightDay: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
  },
  nightDayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  todayBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: rounding,
  },
  todayBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  nightDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: gap.sm,
  },
  nightDetailText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
