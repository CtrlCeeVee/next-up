import { Container } from "../../../components";
import { PlayerDetailsDto } from "../types";
import { PlayerListItem } from "./player-list-item.component";

export interface PlayerListProps {
  players: PlayerDetailsDto[];
  actionText?: string;
  onAction?: (playerId: string) => void;
}

export const PlayerList = ({
  players,
  actionText,
  onAction,
}: PlayerListProps) => {
  return (
    <Container column grow>
      {players.map((player) => (
        <PlayerListItem
          key={player.id}
          player={player}
          actionText={actionText ?? undefined}
          onAction={onAction ? () => onAction(player.id) : undefined}
        />
      ))}
    </Container>
  );
};
