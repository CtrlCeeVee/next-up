import React from "react";
import {
  ActivityIndicator,
  DimensionValue,
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
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
}

const DEFAULT_FALLBACK_BACKGROUND_COLOR = "#e5e7eb";

const isRemoteImageSource = (source: ImageSourcePropType): boolean => {
  if (typeof source !== "object" || source === null) {
    return false;
  }

  if (Array.isArray(source)) {
    return source.some((imageSource) => Boolean(imageSource?.uri));
  }

  return "uri" in source && Boolean(source.uri);
};

export const LazyImage: React.FC<LazyImageProps> = ({
  source,
  width,
  height,
  rounding = 0,
  style,
  containerStyle,
  resizeMode = "cover",
  fallbackBackgroundColor = DEFAULT_FALLBACK_BACKGROUND_COLOR,
}) => {
  const [isImageLoading, setIsImageLoading] = React.useState<boolean>(
    isRemoteImageSource(source)
  );

  React.useEffect(() => {
    setIsImageLoading(isRemoteImageSource(source));
  }, [source]);

  return (
    <View
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
