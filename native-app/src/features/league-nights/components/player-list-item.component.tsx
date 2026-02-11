import { Button, Container, ThemedText } from "../../../components";
import { gap, paddingSmall, useTheme } from "../../../core";
import { TextStyle } from "../../../core";
import { Icon } from "../../../icons";
import { PlayerDetailsDto } from "../types";

interface PlayerListItemProps {
  player: PlayerDetailsDto;
  actionText: string | undefined;
  onAction: () => void;
}

export const PlayerListItem = ({
  player,
  actionText,
  onAction,
}: PlayerListItemProps) => {
  const { theme } = useTheme();
  return (
    <Container column growHorizontal>
      <Container
        row
        centerVertical
        growHorizontal
        gap={gap.md}
        padding={paddingSmall}
        style={{ borderBottomWidth: 1, borderColor: theme.colors.border }}
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
        {actionText && (
          <Button
            text={actionText}
            onPress={onAction}
            variant="ghost"
            size="small"
          />
        )}
      </Container>
    </Container>
  );
};
