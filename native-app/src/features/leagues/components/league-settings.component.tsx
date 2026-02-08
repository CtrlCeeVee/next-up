import { StyleSheet, View } from "react-native";
import { Icon } from "../../../icons/icon.component";
import { TextStyle } from "../../../core/styles/text";
import { Button, ThemedText } from "../../../components";
import { useTheme } from "../../../core/theme";
import { useMembershipState } from "../../membership/state";
import { useAuthState } from "../../auth/state";
import { padding, rounding, spacing } from "../../../core/styles/global";

export const LeagueSettingsComponent = ({
  isUserMember,
  leagueId,
}: {
  leagueId: string;
  isUserMember: boolean;
}) => {
  const { theme } = useTheme();
  const { user } = useAuthState();

  const isMember = useMembershipState((state) => state.isMember);
  const joinLeague = useMembershipState((state) => state.joinLeague);
  const leaveLeague = useMembershipState((state) => state.leaveLeague);
  const joining = useMembershipState((state) => state.joining);
  const leaving = useMembershipState((state) => state.leaving);

  const handleJoinLeave = async () => {
    if (!user) return;

    try {
      if (isMember(leagueId)) {
        await leaveLeague(leagueId, user.id);
      } else {
        await joinLeague(leagueId, user.id);
      }
    } catch (error) {
      console.error("Error joining/leaving league:", error);
    }
  };

  return (
    <View>
      {!isUserMember && (
        <View
          style={[
            styles.ctaCard,
            { backgroundColor: theme.colors.primary + "10" },
          ]}
        >
          <Icon name="user-add" size={32} color={theme.colors.primary} />
          <ThemedText textStyle={TextStyle.Subheader} style={styles.ctaTitle}>
            Join This League
          </ThemedText>
          <ThemedText textStyle={TextStyle.Body} style={styles.ctaText}>
            Become a member to access league nights, view members, and compete
            in matches!
          </ThemedText>
          <Button
            text="Join Now"
            onPress={handleJoinLeave}
            loading={joining}
            disabled={joining}
            leftIcon="user-add"
          />
        </View>
      )}

      {/* Join/Leave Button */}
      <Button
        text={isUserMember ? "Leave League" : "Join League"}
        variant={isUserMember ? "outline" : "primary"}
        onPress={handleJoinLeave}
        loading={joining || leaving}
        disabled={joining || leaving}
        leftIcon={isUserMember ? "x" : "user-add"}
        style={styles.joinButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ctaCard: {
    padding: padding,
    borderRadius: rounding,
  },
  ctaTitle: {
    marginBottom: spacing.sm,
  },
  ctaText: {
    marginBottom: spacing.sm,
  },
  joinButton: {
    width: "100%",
  },
});
