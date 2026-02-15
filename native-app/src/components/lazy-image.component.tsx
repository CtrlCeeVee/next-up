import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  DimensionValue,
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { ShimmerComponent } from "./shimmer-component";

interface LazyImageProps {
  source: ImageSourcePropType;
  width: DimensionValue;
  height: DimensionValue;
  rounding?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
  fallbackBackgroundColor?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const DEFAULT_FALLBACK_BACKGROUND_COLOR = "#e5e7eb";
const MAX_LOADING_TIME = 1000;

export const LazyImage: React.FC<LazyImageProps> = ({
  source,
  width,
  height,
  rounding = 0,
  style,
  containerStyle,
  resizeMode = "cover",
  fallbackBackgroundColor = DEFAULT_FALLBACK_BACKGROUND_COLOR,
  onLayout,
}) => {
  const [isImageLoading, setIsImageLoading] = React.useState<boolean>(false);
  const [hasBeenLoaded, setHasBeenLoaded] = React.useState<boolean>(false);

  const onLoadStart = useCallback(() => {
    if (hasBeenLoaded) return;
    setIsImageLoading(true); // Set loading to true when the image starts loading

    setTimeout(() => {
      setIsImageLoading(false);
    }, MAX_LOADING_TIME);
  }, [setIsImageLoading]);

  const onLoadEnd = useCallback(() => {
    setIsImageLoading(false); // Set loading to false when the image load ends (success or failure)
    setHasBeenLoaded(true);
  }, [setIsImageLoading]);

  return (
    <View
      onLayout={onLayout}
      style={[
        {
          width,
          height,
          borderRadius: rounding,
          overflow: "hidden",
          backgroundColor: fallbackBackgroundColor,
          justifyContent: "center",
          alignItems: "center",
        },
        containerStyle,
      ]}
    >
      <Image
        source={source}
        resizeMode={resizeMode}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        style={[
          {
            width: "100%",
            height: "100%",
            borderRadius: rounding,
          },
          style,
        ]}
      />

      {isImageLoading ? (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ShimmerComponent
            width="100%"
            height="100%"
            rounding={rounding}
            baseColor={DEFAULT_FALLBACK_BACKGROUND_COLOR}
          />
        </View>
      ) : null}
    </View>
  );
};
