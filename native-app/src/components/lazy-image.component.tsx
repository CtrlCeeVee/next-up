import React from "react";
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
        onLoadStart={() => setIsImageLoading(true)}
        onLoadEnd={() => setIsImageLoading(false)}
        style={[
          {
            width: "100%",
            height: "100%",
            borderRadius: rounding,
          },
          style,
        ]}
      />

      {isImageLoading && (
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
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};
