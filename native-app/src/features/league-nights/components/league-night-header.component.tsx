import { StyleSheet, View } from "react-native";
import { ThemedText } from "../../../components";
import { GlobalStyles, TextStyle } from "../../../core/styles";
import { League } from "../../leagues/types";
import { LeagueNightInstance } from "../types/league-night";

export interface LeagueNightHeaderComponentProps {
  league: League;
  leagueNight: LeagueNightInstance;
}

export const LeagueNightHeaderComponent: React.FC<
  LeagueNightHeaderComponentProps
> = ({ league, leagueNight }) => {
  return (
    <View style={styles.header}>
      <ThemedText textStyle={TextStyle.Header}>{league.name}</ThemedText>
      <ThemedText textStyle={TextStyle.Subheader}>
        {leagueNight.day} League Night
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
  },
  header: {
    alignItems: "center",
    gap: 12,
  },
});
