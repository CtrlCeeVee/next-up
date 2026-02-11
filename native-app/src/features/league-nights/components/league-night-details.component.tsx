import { StyleSheet, View } from "react-native";
import { LeagueNightInstance } from "../types/league-night";
import { ThemedText } from "../../../components";
import { GlobalStyles, TextStyle } from "../../../core/styles";
import { League } from "../../leagues/types";
import { Icon, IconName } from "../../../icons";
import { useTheme } from "../../../core/theme";

export interface LeagueNightDetailsComponentProps {
  league: League;
  leagueNight: LeagueNightInstance;
}

export const LeagueNightDetailsComponent: React.FC<
  LeagueNightDetailsComponentProps
> = ({ league, leagueNight }) => {
  const theme = useTheme();
  const notesPlaceholder = "Don't forget R50 for boerewors!";

  const getDateString = (dateString: string) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    const dayOfWeek = days[date.getDay()];

    return `${dayOfWeek}, ${date.toLocaleDateString("en-GB", { month: "long", day: "numeric" })}`;
  };

  const renderInfoSection = (icon: IconName, label: string, value: string) => {
    return (
      <View style={styles.detailSection}>
        <View style={styles.detailHeader}>
          <Icon name={icon} size={18} color={theme.theme.colors.primary} />
          <ThemedText textStyle={TextStyle.Body}>{label}</ThemedText>
        </View>
        <ThemedText textStyle={TextStyle.Body}>{value}</ThemedText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderInfoSection("map-pin", "Location", league.location)}
      {renderInfoSection("calendar", "Date", getDateString(leagueNight.date))}
      {renderInfoSection("clock", "Time", leagueNight.time)}
      {renderInfoSection(
        "trophy",
        "Status",
        leagueNight.status.charAt(0).toUpperCase() + leagueNight.status.slice(1)
      )}
      {renderInfoSection(
        "user-check",
        "Checked In",
        leagueNight.checkedInCount.toString()
      )}
      {renderInfoSection(
        "file-text",
        "Night Notes",
        notesPlaceholder || "No notes yet..."
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    alignItems: "flex-start",
    gap: 12,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailSection: {},
  header: {
    alignItems: "center",
    gap: 12,
  },
});
