import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
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
  onContentLayout?: (height: number) => void;
  modalStyle?: StyleProp<ViewStyle>;
  sheetBackgroundStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const DEFAULT_SNAP_POINTS: Array<string> = ["35%", "65%"];
const DEFAULT_HANDLE_HEIGHT = 18;

export const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
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
  onContentLayout,
  modalStyle,
  sheetBackgroundStyle,
  handleStyle,
  handleIndicatorStyle,
  contentContainerStyle,
}) => {
  const { theme } = useTheme();
  const { height: windowHeight } = useWindowDimensions();

  const bottomSheetReference = useRef<BottomSheet>(null);

  const getSnapPointHeight = (snapPoint: string | number): number => {
    if (typeof snapPoint === "number") {
      console.log("snapPoint", snapPoint);
      return snapPoint + DEFAULT_HANDLE_HEIGHT;
    }

    if (snapPoint.endsWith("%")) {
      return (
        windowHeight * (Number.parseFloat(snapPoint.replace("%", "")) / 100) +
        DEFAULT_HANDLE_HEIGHT
      );
    }

    return 0;
  };

  const memoizedSnapPoints = useMemo(() => {
    console.log("snapPoints", snapPoints);
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
          backgroundColor: theme.colors.sheetBackground,
          // borderColor: theme.colors.border,
          // borderWidth: 1,
          borderTopLeftRadius: rounding,
          borderTopRightRadius: rounding,
        },
        sheetBackgroundStyle,
      ]}
      handleStyle={handleStyle}
      handleIndicatorStyle={[
        {
          backgroundColor: theme.colors.muted,
          width: 44,
        },
        handleIndicatorStyle,
      ]}
    >
      <BottomSheetView
        onLayout={handleSheetContentLayout}
        style={[styles.contentContainer, contentContainerStyle]}
      >
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: padding,
    paddingTop: spacing.sm,
    // paddingBottom: spacing.lg,
  },
});
