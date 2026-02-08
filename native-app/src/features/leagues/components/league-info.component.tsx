import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
  roundingMedium,
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
          <Container column growHorizontal gap={gap.sm}>
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
                <ThemedText
                  textStyle={TextStyle.BodySmall}
                  color={"white"}
                  muted
                >
                  {leagueNights.length} upcoming league nights
                </ThemedText>
              </Container>
            </HoverButton>
          </Container>
        );
      }
    }
  };

  return (
    <ScrollArea style={styles.container} hoverActions={renderHoverActions()}>
      <Container column growHorizontal>
        <ThemedText textStyle={TextStyle.BodyMedium} muted>
          Location
        </ThemedText>
        <Card>
          <Container column gap={gap.md}>
            <ThemedText textStyle={TextStyle.Body}>{league.address}</ThemedText>
            <Button
              text="Get Directions"
              leftIcon="map-pin"
              onPress={() => {}}
              style={{
                width: "100%",
                borderRadius: roundingMedium,
                backgroundColor: "#006df0",
                marginTop: gap.sm,
              }}
            />
          </Container>
        </Card>
      </Container>

      <Container column growHorizontal>
        <ThemedText textStyle={TextStyle.BodyMedium} muted>
          Schedule
        </ThemedText>
        <Card>
          <Container
            paddingVertical={padding}
            paddingHorizontal={paddingLarge}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}
          >
            <LeagueDays leagueDays={league.leagueDays} />
          </Container>
          <Container
            row
            centerVertical
            spaceBetween
            gap={gap.md}
            paddingVertical={padding}
            paddingHorizontal={paddingLarge}
          >
            <ThemedText textStyle={TextStyle.BodyMedium} muted>
              Start Time
            </ThemedText>
            <ThemedText textStyle={TextStyle.Body}>
              {getLeagueTime()}
            </ThemedText>
          </Container>
        </Card>
      </Container>

      <Container column growHorizontal>
        <ThemedText textStyle={TextStyle.BodyMedium} muted>
          Members
        </ThemedText>
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
