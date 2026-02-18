import { Container, ThemedText } from "../../../components";
import { gap, padding, TextStyle } from "../../../core/styles";
import { LeagueNightInstance } from "../types/league-night";
import { League } from "../../leagues/types";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GetMatchesResponse, GetMatchResponse, Match } from "../types";
import { MatchesList } from "../../matches/components";
import { SelectPartnershipComponent } from "./select-partnership.component";
import { TabScreen } from "../../../components/tab-screen.component";
import { useAuthState } from "../../auth/state";
import { leagueNightsService } from "../../../di";
import { GetCheckedInPlayerResponse } from "../services/responses/get-checkedin-player.response";
import { ProfileData } from "../../profiles/types";
import { MatchItemProps } from "../../matches/components/match-item.component";

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

  const quote = [
    "It's time for rest and relaxation!",
    "Time to rest up with a nice cup of tea!",
    "Take the day off!",
  ];

  const getRandomQuote = () => {
    return quote[Math.floor(Math.random() * quote.length)];
  };

  const renderMatches = () => {
    if (!leagueNight) return null;

    return (
      <Container
        column
        gap={gap.md}
        padding={padding}
        w100
        style={{ marginTop: 12 }}
      >
        <MatchesList league={league} leagueNight={leagueNight} />
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
