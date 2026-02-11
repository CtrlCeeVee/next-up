import { Button, Container, ThemedText } from "../../../components";
import { gap, paddingSmall, useTheme } from "../../../core";
import { TextStyle } from "../../../core";
import { Icon } from "../../../icons";
import { PlayerDetailsDto } from "../types";

interface PlayerListItemProps {
  player: PlayerDetailsDto;
  actionText?: string;
  onAction?: () => void;
  showBorder?: boolean;
}

export const PlayerListItem = ({
  player,
  actionText,
  onAction,
  showBorder = true,
}: PlayerListItemProps) => {
  const { theme } = useTheme();

  const renderActionButton = () => {
    if (!actionText) return null;

    if (onAction === undefined) {
      return (
        <ThemedText textStyle={TextStyle.Body} muted>
          {actionText}
        </ThemedText>
      );
    }

    return (
      <Button
        text={actionText}
        onPress={onAction}
        variant="ghost"
        size="small"
      />
    );
  };

  return (
    <Container row grow>
      <Container
        row
        w100
        centerVertical
        gap={gap.md}
        padding={paddingSmall}
        style={{
          borderBottomWidth: showBorder ? 1 : 0,
          borderColor: theme.colors.border,
        }}
        spaceBetween
      >
        <Container row centerVertical gap={gap.lg}>
          <Icon name="user" size={18} color={theme.colors.primary} />
          <Container column startVertical>
            <ThemedText textStyle={TextStyle.Body}>{player.name}</ThemedText>
            <ThemedText
              textStyle={TextStyle.Body}
              style={{ color: theme.colors.muted }}
            >
              {player.skillLevel}
            </ThemedText>
          </Container>
        </Container>
        {renderActionButton()}
      </Container>
    </Container>
  );
};
