import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  Button,
  Card,
  Container,
  ScrollArea,
  ThemedText,
} from "../../../components";
import { Icon } from "../../../icons/icon.component";
import { TextStyle } from "../../../core/styles/text";
import {
  GlobalStyles,
  padding,
  paddingLarge,
  paddingSmall,
  paddingXSmall,
  rounding,
  roundingMedium,
  roundingSmall,
} from "../../../core/styles";
import { gap } from "../../../core/styles";
import { useTheme } from "../../../core/theme";
import { League } from "../types";
import { Map } from "../../../components/map.component";
import { LeagueMembersComponent } from "./league-members.component";
import { useMembershipState } from "../../membership/state";
import { LeagueNightInstance } from "../../league-nights/types";
import { StarryBackgroundComponent } from "../../../components/starry-background.component";
import { LeagueDays } from "./league-days.component";
import { useAuthState } from "../../auth/state";
import { HoverButton } from "../../../components/hover-button.component";

export const LeagueInfoComponent = ({
  league,
  leagueNights,
}: {
  league: League;
  leagueNights: LeagueNightInstance[];
}) => {
  const { theme } = useTheme();
  const isMember = useMembershipState((state) => state.isMember);
  const { user } = useAuthState();
  const joinLeague = useMembershipState((state) => state.joinLeague);

  const getLeagueTime = () => {
    return `${league.startTime.split(":").slice(0, 2).join(":")}`;
  };

  const renderHoverActions = () => {
    if (!isMember(league.id)) {
      return (
        <HoverButton
          leftIcon="user-add"
          backgroundColor={theme.colors.primary}
          onPress={() => {
            if (user) {
              joinLeague(league.id, user.id);
            }
          }}
        >
          <Container column gap={0} paddingVertical={paddingXSmall}>
            <ThemedText textStyle={TextStyle.BodyMedium} color={"white"}>
              Join this League
            </ThemedText>
          </Container>
        </HoverButton>
      );
    } else {
      if (leagueNights.length > 0) {
        return (
          <HoverButton
            leftIcon="moon"
            backgroundColor={"#18181b"}
            onPress={() => {}}
            showRightChevron={true}
          >
            <Container column gap={0}>
              <ThemedText textStyle={TextStyle.BodyMedium} color={"white"}>
                View Upcoming League Nights
              </ThemedText>
              <ThemedText textStyle={TextStyle.BodySmall} color={"white"} muted>
                {leagueNights.length} upcoming league nights
              </ThemedText>
            </Container>
          </HoverButton>
        );
      }
    }
  };

  return (
    <ScrollArea style={styles.container} hoverActions={renderHoverActions()}>
      <Container column grow gap={gap.md} w100>
        <Container column grow w100>
          <Container row grow spaceBetween centerVertical>
            <ThemedText textStyle={TextStyle.BodyMedium}>Location</ThemedText>
          </Container>
          <Card>
            <Container column startHorizontal gap={gap.md}>
              <Container row spaceBetween centerVertical grow>
                <ThemedText textStyle={TextStyle.BodyMedium} color={"white"}>
                  {league.location}
                </ThemedText>
              </Container>
              <ThemedText textStyle={TextStyle.BodySmall} color={"white"}>
                {league.address}
              </ThemedText>
              <Container row centerVertical gap={gap.sm} grow endHorizontal>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    borderRadius: rounding,
                    paddingVertical: paddingSmall,
                    paddingHorizontal: padding,
                    backgroundColor: "#2563eb",
                  }}
                >
                  <Container row centerVertical gap={gap.sm}>
                    <Icon name="open-external" size={16} color={"#dddddd"} />
                    <ThemedText
                      textStyle={TextStyle.BodySmall}
                      color={"#dddddd"}
                    >
                      Open in {Platform.OS === "ios" ? "Maps" : "Google Maps"}
                    </ThemedText>
                  </Container>
                </TouchableOpacity>
              </Container>
            </Container>
          </Card>
        </Container>

        <Container column grow w100>
          <ThemedText textStyle={TextStyle.BodyMedium}>Schedule</ThemedText>
          <Card>
            <Container column w100>
              <LeagueDays
                leagueDays={league.leagueDays.map((day) => ({
                  dayOfWeek: day,
                  startTime: league.startTime,
                }))}
              />
              <Container column centerHorizontal paddingVertical={padding}>
                <ThemedText textStyle={TextStyle.BodySmall} muted center>
                  This is the standard schedule for this league. Some nights may
                  be cancelled or rescheduled. Make sure to check the Upcoming
                  League Nights for the most up-to-date information.
                </ThemedText>
              </Container>
              <Container row centerVertical gap={gap.sm} w100 endHorizontal>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    borderRadius: rounding,
                    paddingVertical: padding,
                    paddingHorizontal: padding,
                    backgroundColor: "#18181b",
                  }}
                >
                  <Container row centerVertical gap={gap.sm}>
                    <ThemedText
                      textStyle={TextStyle.BodySmall}
                      color={"#dddddd"}
                    >
                      View Upcoming
                    </ThemedText>
                    <Icon name="chevron-right" size={16} color={"#dddddd"} />
                  </Container>
                </TouchableOpacity>
              </Container>
            </Container>
          </Card>
        </Container>

        <Container column grow w100>
          <ThemedText textStyle={TextStyle.BodyMedium}>Members</ThemedText>
          <LeagueMembersComponent
            isMember={isMember(league.id)}
            members={
              league.members || [
                {
                  id: "1",
                  name: "John Doe",
                  email: "john.doe@example.com",
                  skillLevel: "Beginner",
                  role: "player",
                  joinedAt: new Date().toISOString(),
                },
                {
                  id: "2",
                  name: "Jane Doe",
                  email: "jane.doe@example.com",
                  skillLevel: "Beginner",
                  role: "player",
                  joinedAt: new Date().toISOString(),
                },
                {
                  id: "3",
                  name: "Jim Doe",
                  email: "jim.doe@example.com",
                  skillLevel: "Beginner",
                  role: "player",
                  joinedAt: new Date().toISOString(),
                },
                {
                  id: "4",
                  name: "Jill Doe",
                  email: "jill.doe@example.com",
                  skillLevel: "Beginner",
                  role: "player",
                  joinedAt: new Date().toISOString(),
                },
                {
                  id: "5",
                  name: "Jill Doe",
                  email: "jill.doe@example.com",
                  skillLevel: "Beginner",
                  role: "player",
                  joinedAt: new Date().toISOString(),
                },
              ]
            }
          />
        </Container>
      </Container>
    </ScrollArea>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  bottomActionStarry: {
    borderRadius: roundingMedium,
  },
  bottomActionDark: {
    paddingVertical: padding,
    paddingHorizontal: paddingLarge,
    borderRadius: roundingMedium,
    width: "100%",
  },
});
