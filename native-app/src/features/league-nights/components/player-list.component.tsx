import { Container, ThemedText } from "../../../components";
import { paddingSmall, TextStyle, useTheme } from "../../../core";
import { PlayerDetailsDto } from "../types";
import { PlayerListItem } from "./player-list-item.component";

export interface PlayerListProps {
  title: string;
  emptyText: string;
  players: PlayerDetailsDto[];
  actionText: string;
  onAction: (playerId: string) => void;
}

export const PlayerList = ({
  title,
  emptyText,
  players,
  actionText,
  onAction,
}: PlayerListProps) => {
  const { theme } = useTheme();
  return (
    <Container column growHorizontal>
      <ThemedText textStyle={TextStyle.Body}>{title}</ThemedText>
      <Container column padding={paddingSmall} growHorizontal>
        {players.length > 0 ? (
          players.map((player) => (
            <PlayerListItem
              key={player.id}
              player={player}
              actionText={actionText}
              onAction={() => onAction(player.id)}
            />
          ))
        ) : (
          <ThemedText
            textStyle={TextStyle.Body}
            style={{ color: theme.colors.muted }}
          >
            {emptyText}
          </ThemedText>
        )}
      </Container>
    </Container>
  );
};
