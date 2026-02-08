import { StyleSheet, View } from "react-native";
import { Button, Card, Container, ThemedText } from "../../../components";
import { TextStyle } from "../../../core/styles/text";
import { LeagueMember } from "../../membership/types";
import {
  gap,
  padding,
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
    memberIcons: {},
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

    const iconSize = 32;

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
    <Card>
      <Container column centerHorizontal growHorizontal gap={gap.md}>
        <ThemedText textStyle={TextStyle.BodyMedium} muted>
          This League currently has {members.length} members
        </ThemedText>
        {members.length === 0 && (
          <Button
            text="Be the first member"
            onPress={() => {}}
            leftIcon="user-add"
            style={{ borderRadius: rounding - padding, width: "100%" }}
          />
        )}
        {members.length > 0 && (
          <>
            <Container row gap={gap.md} style={styles.memberIcons}>
              {renderMemberIcons()}
            </Container>
          </>
        )}
      </Container>
    </Card>
  );
};
