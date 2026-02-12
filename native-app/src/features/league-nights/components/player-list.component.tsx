import { Container } from "../../../components";
import { BasePlayerDetails } from "../../player/types";
import {
  PartnershipItemVariant,
  PlayerListItem,
} from "./player-list-item.component";

export interface PlayerListProps {
  players: BasePlayerDetails[];
  variant: PartnershipItemVariant;
  onAction?: (playerId: string) => void;
}

export const PlayerList = ({ players, variant, onAction }: PlayerListProps) => {
  return (
    <Container column grow>
      {players.map((player) => (
        <PlayerListItem
          key={player.id}
          player={player}
          variant={variant}
          onAction={onAction ? () => onAction(player.id) : undefined}
        />
      ))}
    </Container>
  );
};
