import { DimensionValue, ViewStyle } from "react-native";
import { TextStyle } from "../core";
import { Container } from "./container.component";
import { ThemedText } from "./themed-text.component";
import { LazyImage } from "./lazy-image.component";

interface MapSnapshotProps {
  latitude: number;
  longitude: number;
  width: DimensionValue;
  height: DimensionValue;
  rounding: number;
  style: ViewStyle;
}

export const MapSnapshot = ({
  latitude,
  longitude,
  width,
  height,
  rounding,
  style,
}: MapSnapshotProps) => {
  return (
    <Container column w100 style={style}>
      <LazyImage
        source={{
          uri: `https://i.sstatic.net/HILmr.png`,
        }}
        width={width}
        height={height}
        rounding={rounding}
      />
    </Container>
  );
};
