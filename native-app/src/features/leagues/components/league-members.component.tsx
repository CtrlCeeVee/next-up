import { StyleSheet, View } from "react-native";
import { Button, Card, Container, ThemedText } from "../../../components";
import { TextStyle } from "../../../core/styles/text";
import { LeagueMember } from "../../membership/types";
import {
  gap,
  padding,
  paddingSmall,
  rounding,
  roundingFull,
  roundingLarge,
  roundingMedium,
  roundingSmall,
  spacing,
} from "../../../core/styles";
import { LeagueMemberIconComponent } from "./league-member-icon.component";
import { useTheme } from "../../../core/theme";
import { Icon } from "../../../icons";

export const LeagueMembersComponent = ({
  members,
  isMember,
}: {
  members: LeagueMember[];
  isMember: boolean;
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    image: {
      marginLeft: -14,
    },
    plusIcon: {
      backgroundColor: theme.colors.primary,
      borderRadius: roundingFull,
    },
  });

  const renderMemberIcons = () => {
    let membersToRender = members;
    if (members.length > 3) {
      membersToRender = members.slice(0, 3);
    }

    const iconSize = 24;

    const icons = membersToRender.map((member, index) => {
      const iconStyle = {
        marginLeft: index > 0 ? -iconSize / 1.5 : 0,
        zIndex: membersToRender.length - index,
      };

      return (
        <LeagueMemberIconComponent
          key={member.id}
          member={member}
          size={iconSize}
          style={iconStyle}
        />
      );
    });

    return (
      <>
        {icons}
        {members.length > 3 && (
          <View
            style={[
              styles.plusIcon,
              {
                backgroundColor: theme.colors.primary + "20",
                width: iconSize,
                height: iconSize,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: -iconSize / 2,
              },
            ]}
          >
            <ThemedText
              textStyle={TextStyle.BodySmall}
              color={theme.colors.text}
            >
              +{members.length - 3}
            </ThemedText>
          </View>
        )}
      </>
    );
  };

  return (
    <Container
      style={{ backgroundColor: "white" }}
      column
      centerHorizontal
      centerVertical
      padding={paddingSmall}
      rounding={rounding}
      gap={gap.md}
    >
      <Container row centerVertical>
        <Container row gap={gap.md} centerHorizontal>
          {renderMemberIcons()}
        </Container>
        <ThemedText textStyle={TextStyle.BodyMedium} center color={"black"}>
          {members.length} members
        </ThemedText>
      </Container>
    </Container>
  );
};
