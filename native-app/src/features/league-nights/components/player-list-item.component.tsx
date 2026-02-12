import { TouchableOpacity } from "react-native";
import { Button, Container, ThemedText } from "../../../components";
import { gap, padding, paddingSmall, useTheme } from "../../../core";
import { TextStyle } from "../../../core";
import { Icon, IconName } from "../../../icons";
import { BasePlayerDetails } from "../../player/types";

export enum PartnershipItemVariant {
  RECEIVED_REQUEST = "receivedRequest",
  SENT_REQUEST = "sentRequest",
  AVAILABLE_PARTNER = "availablePartner",
  CONFIRMED_PARTNERSHIP = "confirmedPartnership",
}

interface PlayerListItemProps {
  player: BasePlayerDetails;
  variant: PartnershipItemVariant;
  onAction?: () => void;
  showBorder?: boolean;
  actionBusy?: boolean;
}

export const PlayerListItem = ({
  player,
  variant,
  onAction,
  showBorder = true,
  actionBusy = false,
}: PlayerListItemProps) => {
  const { theme } = useTheme();

  const renderActionButton = () => {
    switch (variant) {
      case PartnershipItemVariant.RECEIVED_REQUEST:
        return (
          <Button
            text="Accept"
            onPress={() => onAction?.()}
            variant="primary"
            size="small"
            backgroundColor={theme.colors.accent}
            loading={actionBusy}
          />
        );
      case PartnershipItemVariant.SENT_REQUEST:
        return (
          <ThemedText textStyle={TextStyle.BodySmall} muted>
            Sent
          </ThemedText>
          // <Button
          //   text="Cancel"
          //   onPress={() => onAction?.()}
          //   variant="primary"
          //   backgroundColor={theme.colors.danger}
          //   size="small"
          //   loading={actionBusy}
          // />
        );
      case PartnershipItemVariant.AVAILABLE_PARTNER:
        return (
          <Button
            text="Request"
            onPress={() => onAction?.()}
            variant="primary"
            backgroundColor={theme.colors.primary}
            size="small"
            loading={actionBusy}
          />
        );
      default:
        return null;
    }
  };

  const getPrefix = () => {
    switch (variant) {
      case PartnershipItemVariant.RECEIVED_REQUEST:
        return "Invite from ";
      case PartnershipItemVariant.SENT_REQUEST:
        return "Sent to ";
      case PartnershipItemVariant.AVAILABLE_PARTNER:
        return "";
      case PartnershipItemVariant.CONFIRMED_PARTNERSHIP:
        return "You are playing with ";
      default:
        return "";
    }
  };

  const getIcon = (): React.ReactNode => {
    switch (variant) {
      case PartnershipItemVariant.RECEIVED_REQUEST:
        return <Icon name="inbox" size={18} color={theme.colors.accent} />;
      case PartnershipItemVariant.SENT_REQUEST:
        return <Icon name="outbox" size={18} color={theme.colors.muted} />;
      case PartnershipItemVariant.AVAILABLE_PARTNER:
        return <Icon name="user" size={18} color={theme.colors.primary} />;
      case PartnershipItemVariant.CONFIRMED_PARTNERSHIP:
        return <Icon name="checkmark" size={18} color={theme.colors.primary} />;
      default:
        return <Icon name="user" size={18} color={theme.colors.primary} />;
    }
  };

  return (
    <Container
      row
      w100
      centerVertical
      gap={gap.md}
      paddingVertical={padding}
      style={{
        borderBottomWidth: showBorder ? 1 : 0,
        borderColor: theme.colors.border,
      }}
      spaceBetween
    >
      <Container row centerVertical gap={gap.lg}>
        {getIcon()}
        <Container column startVertical>
          <ThemedText textStyle={TextStyle.BodyMedium}>
            {getPrefix()}
            {player.firstName} {player.lastName}
          </ThemedText>
          <ThemedText
            textStyle={TextStyle.BodySmall}
            style={{ color: theme.colors.muted }}
          >
            {player.skillLevel}
          </ThemedText>
        </Container>
      </Container>
      {renderActionButton()}
    </Container>
  );
};
