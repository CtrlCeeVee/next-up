import {
  Container,
  ThemedText,
  gap,
  TextStyle,
  Icon,
  roundingMedium,
  padding,
} from "..";

import { TouchableOpacity } from "react-native";
import { StarryBackgroundComponent } from "./starry-background.component";
import { IconName } from "../icons";

export const HoverButton = ({
  children,
  leftIcon = undefined,
  onPress,
  backgroundColor,
  showRightChevron = false,
}: {
  children: React.ReactNode;
  leftIcon?: IconName;
  backgroundColor: string;
  onPress: () => void;
  showRightChevron?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor,
        borderRadius: roundingMedium,
        width: "100%",
        padding: padding,
      }}
    >
      <Container row centerVertical w100 spaceBetween gap={gap.md}>
        <Container row centerVertical gap={gap.lg}>
          {leftIcon && <Icon name={leftIcon} size={20} color={"white"} />}
          {children}
        </Container>
        {showRightChevron && (
          <Icon name="chevron-right" size={20} color={"white"} />
        )}
      </Container>
    </TouchableOpacity>
  );
};
