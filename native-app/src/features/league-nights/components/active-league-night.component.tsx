import { Container, ThemedText } from "../../../components";
import { gap, padding, TextStyle } from "../../../core/styles";
import { LeagueNightInstance } from "../types/league-night";
import { League } from "../../leagues/types";
import { PillTabs } from "../../../components/pill-tabs.component";
import { Icon } from "../../../icons";
import { useTheme } from "../../../core/theme";
import { useState } from "react";
import { Match } from "../types";
import { MatchesList } from "../../matches/components";
import { SelectPartnershipComponent } from "./select-partnership.component";

export interface ActiveLeagueNightComponentProps {
  league: League;
  leagueNight?: LeagueNightInstance;
  matches: Match[];
}

enum ActiveTabs {
  Partnership = "Partnership",
  Matches = "Matches",
}

export const ActiveLeagueNightComponent: React.FC<
  ActiveLeagueNightComponentProps
> = ({ league, leagueNight, matches }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<ActiveTabs>(
    ActiveTabs.Partnership
  );

  console.log("matches", matches);

  const quote = [
    "It's time for rest and relaxation!",
    "Time to rest up with a nice cup of tea!",
    "Take the day off!",
  ];

  const getRandomQuote = () => {
    return quote[Math.floor(Math.random() * quote.length)];
  };

  const render = () => {
    if (!leagueNight) {
      return (
        <Container
          column
          centerVertical
          centerHorizontal
          grow
          gap={gap.md}
        >
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

    const tabChanged = (tab: ActiveTabs) => {
      setSelectedTab(tab);
    };

    const renderMatches = () => {
      return (
        <Container column gap={gap.md} grow w100 style={{ marginTop: 12 }}>
          <MatchesList matches={matches} />
        </Container>
      );
    };

    const renderPartnership = () => {
      return (
        <Container column gap={gap.md} grow w100>
          <SelectPartnershipComponent league={league} night={leagueNight} />
        </Container>
      );
    };

    return (
      <Container column gap={gap.md} grow w100>
        <PillTabs
          options={[ActiveTabs.Partnership, ActiveTabs.Matches]}
          onOptionChange={tabChanged}
          initialOption={ActiveTabs.Partnership}
        />
        {selectedTab === ActiveTabs.Partnership && renderPartnership()}
        {selectedTab === ActiveTabs.Matches && renderMatches()}
      </Container>
    );
  };

  return (
    <Container padding={padding} column grow>
      {render()}
    </Container>
  );
};
