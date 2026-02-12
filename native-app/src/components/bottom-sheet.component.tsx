import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  processColor,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../core/theme";
import { padding, rounding, spacing, TextStyle } from "../core/styles";
import { ThemedText } from "./themed-text.component";
import { Container } from "./container.component";

export enum ActionOnBackdropPress {
  CLOSE = "close",
  COLLAPSE = "collapse",
  NONE = "none",
}

interface AppBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  snapPoints?: Array<string | number>;
  sheetIndex?: number;
  enableDynamicSizing?: boolean;
  enableDragging?: boolean;
  showHandle?: boolean;
  allowSwipeToClose?: boolean;
  actionOnBackdropPress?: ActionOnBackdropPress;

  backdropAppearsOnIndex?: number;
  backdropDisappearsOnIndex?: number;
  backdropOpacity?: number;
  onStageChange?: (stageIndex: number) => void;
  onHeaderLayout?: (height: number) => void;
  onContentLayout?: (height: number) => void;
  modalStyle?: StyleProp<ViewStyle>;
  sheetBackgroundStyle?: StyleProp<ViewStyle>;
  sheetBackgroundColor?: string;
  headerContainerStyle?: ViewStyle;
  handleStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: ViewStyle;
  persistBodyContent?: boolean;
}

const DEFAULT_SNAP_POINTS: Array<string> = ["35%", "65%"];
const DEFAULT_HANDLE_HEIGHT = 18;

const clampChannelValue = (value: number): number => {
  return Math.max(0, Math.min(255, Math.round(value)));
};

const convertProcessedColorToRgba = (
  colorValue: number
): {
  red: number;
  green: number;
  blue: number;
  alpha: number;
} => {
  const normalizedColorValue = colorValue >>> 0;

  return {
    alpha: ((normalizedColorValue >> 24) & 255) / 255,
    red: (normalizedColorValue >> 16) & 255,
    green: (normalizedColorValue >> 8) & 255,
    blue: normalizedColorValue & 255,
  };
};

const interpolateRgbaColor = (
  fromColor: string,
  toColor: string,
  progress: number
): string => {
  const processedFromColor = processColor(fromColor);
  const processedToColor = processColor(toColor);

  if (
    typeof processedFromColor !== "number" ||
    typeof processedToColor !== "number"
  ) {
    return toColor;
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const fromRgba = convertProcessedColorToRgba(processedFromColor);
  const toRgba = convertProcessedColorToRgba(processedToColor);

  const interpolatedRed =
    fromRgba.red + (toRgba.red - fromRgba.red) * clampedProgress;
  const interpolatedGreen =
    fromRgba.green + (toRgba.green - fromRgba.green) * clampedProgress;
  const interpolatedBlue =
    fromRgba.blue + (toRgba.blue - fromRgba.blue) * clampedProgress;
  const interpolatedAlpha =
    fromRgba.alpha + (toRgba.alpha - fromRgba.alpha) * clampedProgress;

  return `rgba(${clampChannelValue(interpolatedRed)}, ${clampChannelValue(interpolatedGreen)}, ${clampChannelValue(interpolatedBlue)}, ${interpolatedAlpha})`;
};

const AnimatedBottomSheetBackground: React.FC<
  BottomSheetBackgroundProps & { backgroundColor: string }
> = ({ style, backgroundColor }) => {
  const transitionProgress = useRef(new Animated.Value(1)).current;
  const colorTransitionState = useRef({
    fromColor: backgroundColor,
    toColor: backgroundColor,
  });
  const [currentColorTransitionState, setCurrentColorTransitionState] =
    React.useState(colorTransitionState.current);

  useEffect(() => {
    if (colorTransitionState.current.toColor === backgroundColor) {
      return;
    }

    transitionProgress.stopAnimation((activeProgress: number) => {
      const currentTransitionState = colorTransitionState.current;
      const visibleColor = interpolateRgbaColor(
        currentTransitionState.fromColor,
        currentTransitionState.toColor,
        activeProgress
      );

      const nextTransitionState = {
        fromColor: visibleColor,
        toColor: backgroundColor,
      };

      colorTransitionState.current = nextTransitionState;
      setCurrentColorTransitionState(nextTransitionState);
      transitionProgress.setValue(0);

      Animated.timing(transitionProgress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
  }, [backgroundColor, transitionProgress]);

  const animatedBackgroundColor = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      currentColorTransitionState.fromColor,
      currentColorTransitionState.toColor,
    ],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          borderTopLeftRadius: rounding,
          borderTopRightRadius: rounding,
        },
        {
          backgroundColor: animatedBackgroundColor,
        },
      ]}
    />
  );
};

export const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  headerContent,
  snapPoints = DEFAULT_SNAP_POINTS,
  sheetIndex = 0,
  enableDynamicSizing = false,
  enableDragging = true,
  showHandle = true,
  allowSwipeToClose = true,
  actionOnBackdropPress = ActionOnBackdropPress.NONE,
  backdropAppearsOnIndex = 0,
  backdropDisappearsOnIndex = -1,
  backdropOpacity = 0.35,
  onStageChange,
  onHeaderLayout,
  onContentLayout,
  modalStyle,
  sheetBackgroundStyle,
  sheetBackgroundColor,
  headerContainerStyle,
  handleStyle,
  handleIndicatorStyle,
  contentContainerStyle,
  persistBodyContent = false,
}) => {
  const { theme } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const resolvedSheetBackgroundColor =
    sheetBackgroundColor ?? theme.colors.sheetBackground;
  const resolvedSheetBackgroundColorReference = useRef(
    resolvedSheetBackgroundColor
  );
  resolvedSheetBackgroundColorReference.current = resolvedSheetBackgroundColor;

  const bottomSheetReference = useRef<BottomSheet>(null);

  const getSnapPointHeight = (snapPoint: string | number): number => {
    if (typeof snapPoint === "number") {
      return snapPoint;
    }

    if (snapPoint.endsWith("%")) {
      return (
        windowHeight * (Number.parseFloat(snapPoint.replace("%", "")) / 100)
      );
    }

    return 0;
  };

  const memoizedSnapPoints = useMemo(() => {
    return snapPoints.map((snapPoint) => {
      return getSnapPointHeight(snapPoint);
    });
  }, [snapPoints]);
  const isDraggingEnabled = enableDragging && showHandle;

  useEffect(() => {
    if (isOpen) {
      bottomSheetReference.current?.snapToIndex(sheetIndex);
      return;
    }

    bottomSheetReference.current?.close();
  }, [sheetIndex, isOpen]);

  const backdropPressBehavior = useMemo(() => {
    switch (actionOnBackdropPress) {
      case ActionOnBackdropPress.CLOSE:
        return ActionOnBackdropPress.CLOSE;
      case ActionOnBackdropPress.COLLAPSE:
        return ActionOnBackdropPress.COLLAPSE;
      case ActionOnBackdropPress.NONE:
      default:
        return ActionOnBackdropPress.NONE;
    }
  }, [actionOnBackdropPress]);

  const handleSheetContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    onContentLayout?.(height);
  };

  const handleSheetHeaderLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    onHeaderLayout?.(height + DEFAULT_HANDLE_HEIGHT);
  };

  const renderBackdrop = useCallback(
    (backdropProperties: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProperties}
        appearsOnIndex={backdropAppearsOnIndex}
        disappearsOnIndex={backdropDisappearsOnIndex}
        opacity={backdropOpacity}
        enableTouchThrough={true}
        pressBehavior={backdropPressBehavior}
      />
    ),
    [
      backdropAppearsOnIndex,
      backdropDisappearsOnIndex,
      backdropOpacity,
      backdropPressBehavior,
    ]
  );

  const renderBackground = useCallback(
    (backgroundProperties: BottomSheetBackgroundProps) => (
      <AnimatedBottomSheetBackground
        backgroundColor={resolvedSheetBackgroundColorReference.current}
        {...backgroundProperties}
      />
    ),
    []
  );

  const shouldCollapseBodyContent =
    !persistBodyContent && !!headerContent && sheetIndex === 0;

  return (
    <BottomSheet
      ref={bottomSheetReference}
      index={isOpen ? sheetIndex : -1}
      snapPoints={memoizedSnapPoints}
      enableDynamicSizing={enableDynamicSizing}
      onClose={onClose}
      onChange={(stageIndex: number) => {
        onStageChange?.(stageIndex);
      }}
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      enablePanDownToClose={isDraggingEnabled && allowSwipeToClose}
      enableHandlePanningGesture={isDraggingEnabled}
      enableContentPanningGesture={isDraggingEnabled}
      handleComponent={() => (
        <Container
          row
          grow
          centerHorizontal
          centerVertical
          style={{ height: DEFAULT_HANDLE_HEIGHT }}
        >
          {showHandle && (
            <View
              style={{
                width: 44,
                height: 4,
                backgroundColor: theme.colors.muted,
                borderRadius: rounding,
              }}
            />
          )}
        </Container>
      )}
      style={modalStyle}
      backgroundStyle={[
        {
          // borderColor: theme.colors.border,
          // borderWidth: 1,
          borderTopLeftRadius: rounding,
          borderTopRightRadius: rounding,
        },
        sheetBackgroundStyle,
      ]}
      handleStyle={handleStyle}
    >
      <BottomSheetView
        style={{
          flexDirection: "column",
          width: "100%",
          flex: 1,
          height: "100%",
        }}
        pointerEvents={shouldCollapseBodyContent ? "none" : "auto"}
      >
        <Container column w100 grow>
          <Container
            w100
            column
            onLayout={handleSheetHeaderLayout}
            style={headerContainerStyle}
          >
            {headerContent}
          </Container>
          <Container
            column
            w100
            onLayout={handleSheetContentLayout}
            style={{
              ...(shouldCollapseBodyContent &&
                styles.collapsedContentContainer),
              ...contentContainerStyle,
            }}
          >
            {children}
          </Container>
        </Container>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  collapsedContentContainer: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
  },
});
