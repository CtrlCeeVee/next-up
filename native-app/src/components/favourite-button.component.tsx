import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Container, Icon } from "..";
import { useTheme } from "../core/theme";
import {
  roundingFull,
  paddingSmall,
  MIN_TEXTLESS_BUTTON_SIZE,
} from "../core/styles";

export const FavouriteButtonComponent = ({
  onPress,
  style,
  backgroundColor,
  iconColor,
  startHorizontal = false,
  startVertical = false,
  endHorizontal = false,
  endVertical = false,
  centerHorizontal = true,
  centerVertical = true,
}: {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  iconColor?: string;
  startHorizontal?: boolean;
  startVertical?: boolean;
  endHorizontal?: boolean;
  endVertical?: boolean;
  centerHorizontal?: boolean;
  centerVertical?: boolean;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={[styles.heartButtonContainer, style]}
      accessibilityRole="button"
      accessibilityLabel="Toggle favorite league"
    >
      <Container
        column
        rounding={roundingFull}
        padding={paddingSmall}
        style={{
          backgroundColor: "#dddddd80",
        }}
      >
        <Icon name="heart" size={16} color="#fff" />
      </Container>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  heartButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: MIN_TEXTLESS_BUTTON_SIZE,
    height: MIN_TEXTLESS_BUTTON_SIZE,
  },
});
