import { Container, ThemedText } from "../../../components";
import { TextStyle } from "../../../core/styles";
import { Partnership } from "../types";

export interface PartnershipListProps {
  partnerships: Partnership[];
}

export const PartnershipList: React.FC<PartnershipListProps> = ({
  partnerships,
}) => {
  return (
    <Container>
      <ThemedText textStyle={TextStyle.Header}>Partnership</ThemedText>
    </Container>
  );
};
