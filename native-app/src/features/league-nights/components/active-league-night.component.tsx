import { Container, ThemedText } from "../../../components";
import { gap, padding, TextStyle } from "../../../core/styles";
import { LeagueNightInstance } from "../types/league-night";
import { League } from "../../leagues/types";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { useEffect, useState } from "react";
import { Match } from "../types";
import { MatchesList } from "../../matches/components";
import { SelectPartnershipComponent } from "./select-partnership.component";
import { TabScreen } from "../../../components/tab-screen.component";
import { useAuthState } from "../../auth/state";
import { leagueNightsService } from "../../../di";
import { GetCheckedInPlayerResponse } from "../services/responses/get-checkedin-player.response";

export interface ActiveLeagueNightComponentProps {
  league: League;
  leagueNight?: LeagueNightInstance | null;
}

enum ActiveTabs {
  Partnership = "Partnership",
  Matches = "Matches",
}

export const ActiveLeagueNightComponent: React.FC<
  ActiveLeagueNightComponentProps
> = ({ league, leagueNight }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<ActiveTabs>(
    ActiveTabs.Partnership
  );
  const { user } = useAuthState();

  const [matches, setMatches] = useState<Match[]>([]);
  const [checkedInPlayers, setCheckedInPlayers] = useState<
    GetCheckedInPlayerResponse[]
  >([]);

  const fetchMatches = async () => {
    if (!leagueNight || !user) return;
    const response = await leagueNightsService.getMatches(
      league.id,
      leagueNight.id,
      user.id
    );
    setMatches(response);
  };

  const fetchCheckedInPlayers = async () => {
    if (!leagueNight || !user) return;
    const response = await leagueNightsService.getCheckedInPlayers(
      league.id,
      leagueNight.id
    );
    setCheckedInPlayers(response.checkins);
  };

  useEffect(() => {
    fetchMatches();
    fetchCheckedInPlayers();
  }, [leagueNight, user]);

  const quote = [
    "It's time for rest and relaxation!",
    "Time to rest up with a nice cup of tea!",
    "Take the day off!",
  ];

  const getRandomQuote = () => {
    return quote[Math.floor(Math.random() * quote.length)];
  };

  const tabChanged = (tab: ActiveTabs) => {
    setSelectedTab(tab);
  };

  const renderMatches = () => {
    return (
      <Container
        column
        gap={gap.md}
        padding={padding}
        w100
        style={{ marginTop: 12 }}
      >
        <MatchesList matches={matches} />
      </Container>
    );
  };

  const renderPartnership = () => {
    if (!leagueNight) return null;
    return (
      <Container
        column
        gap={gap.md}
        paddingHorizontal={padding}
        style={{ paddingTop: padding }}
        grow
        w100
      >
        <SelectPartnershipComponent league={league} night={leagueNight} />
      </Container>
    );
  };

  const render = () => {
    if (!leagueNight) {
      return (
        <Container column centerVertical centerHorizontal w100 gap={gap.md}>
          <Icon
            name="tennis-ball"
            size={48}
            style={{ color: theme.colors.muted }}
          />
          <ThemedText
            textStyle={TextStyle.Body}
            style={{ color: theme.colors.muted }}
          >
            No active league night
          </ThemedText>
          <ThemedText
            textStyle={TextStyle.Body}
            style={{ color: theme.colors.muted }}
          >
            {getRandomQuote()}
          </ThemedText>
        </Container>
      );
    }

    return (
      <Container column w100 grow>
        <TabScreen
          alignTabsToLeft
          showBottomBorder={false}
          tabs={[
            {
              name: ActiveTabs.Partnership,
              label: "Partnership",
              component: renderPartnership(),
            },
            {
              name: ActiveTabs.Matches,
              label: "Matches",
              component: renderMatches(),
            },
          ]}
        />
      </Container>
    );
  };

  return (
    <Container column w100 grow>
      {render()}
    </Container>
  );
};
