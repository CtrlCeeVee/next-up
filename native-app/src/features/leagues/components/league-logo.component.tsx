import { LayoutChangeEvent, TouchableOpacity, ViewStyle } from "react-native";
import { LazyImage } from "../../../components/lazy-image.component";
import { roundingFull } from "../../../core/styles";
import { Container } from "../../../components";

export const LeagueLogoComponent = ({
  logo,
  width = 40,
  height = 40,
  padding = 0,
  rounding = roundingFull,
  name,
  onPress,
  onLayout,
  style,
}: {
  logo?: string;
  width?: number;
  height?: number;
  rounding?: number;
  padding?: number;
  name: string;
  onPress?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  style?: ViewStyle;
}) => {
  const getFallbackLogo = () => {
    const words = name.split(" ");
    if (words.length === 1) {
      return `https://ui-avatars.com/api/?name=${name}&size=100`;
    }

    const initials = words.map((word) => word[0]).join("");
    return `https://ui-avatars.com/api/?name=${initials}&size=100`;
  };

  const renderImage = () => {
    return (
      <LazyImage
        source={{
          uri: logo || getFallbackLogo(),
        }}
        width="100%"
        height="100%"
        rounding={roundingFull}
      />
    );
  };

  return (
    <Container
      onLayout={onLayout}
      padding={padding}
      style={{ width, height, ...style }}
    >
      {onPress && (
        <TouchableOpacity
          onPress={onPress}
          style={{ width: "100%", height: "100%" }}
        >
          {renderImage()}
        </TouchableOpacity>
      )}
      {!onPress && renderImage()}
    </Container>
  );
};
