import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "../core/theme";
import { padding, spacing } from "../core/styles";

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
  initialSnapIndex?: number;
  enableDynamicSizing?: boolean;
  enableDragging?: boolean;
  showHandle?: boolean;
  allowSwipeToClose?: boolean;
  actionOnBackdropPress?: ActionOnBackdropPress;

  backdropAppearsOnIndex?: number;
  backdropDisappearsOnIndex?: number;
  backdropOpacity?: number;
  onStageChange?: (stageIndex: number) => void;
  modalStyle?: StyleProp<ViewStyle>;
  sheetBackgroundStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const DEFAULT_SNAP_POINTS: Array<string> = ["35%", "65%"];
const DEFAULT_HANDLE_HEIGHT = 24;

export const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  snapPoints = DEFAULT_SNAP_POINTS,
  initialSnapIndex = 0,
  enableDynamicSizing = false,
  enableDragging = true,
  showHandle = true,
  allowSwipeToClose = true,
  actionOnBackdropPress = ActionOnBackdropPress.NONE,
  backdropAppearsOnIndex = 0,
  backdropDisappearsOnIndex = -1,
  backdropOpacity = 0.35,
  onStageChange,
  modalStyle,
  sheetBackgroundStyle,
  handleStyle,
  handleIndicatorStyle,
  contentContainerStyle,
}) => {
  const { theme } = useTheme();
  const bottomSheetReference = useRef<BottomSheet>(null);
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);
  const isDraggingEnabled = enableDragging && showHandle;

  useEffect(() => {
    if (isOpen) {
      bottomSheetReference.current?.snapToIndex(initialSnapIndex);
      return;
    }

    bottomSheetReference.current?.close();
  }, [initialSnapIndex, isOpen]);

  const getBackdropPressBehavior = () => {
    console.log("actionOnBackdropPress", actionOnBackdropPress);
    switch (actionOnBackdropPress) {
      case ActionOnBackdropPress.CLOSE:
        return "close";
      case ActionOnBackdropPress.COLLAPSE:
        return "collapse";
      case ActionOnBackdropPress.NONE:
        return "none";
    }
  };

  const renderBackdrop = useCallback(
    (backdropProperties: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProperties}
        appearsOnIndex={backdropAppearsOnIndex}
        disappearsOnIndex={backdropDisappearsOnIndex}
        opacity={backdropOpacity}
        enableTouchThrough={true}
        onPress={() => {
          console.log("press");
        }}
        pressBehavior={getBackdropPressBehavior()}
      />
    ),
    [
      backdropAppearsOnIndex,
      backdropDisappearsOnIndex,
      backdropOpacity,
      getBackdropPressBehavior,
    ]
  );

  return (
    <BottomSheet
      ref={bottomSheetReference}
      index={isOpen ? initialSnapIndex : -1}
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
      handleComponent={showHandle ? undefined : null}
      style={modalStyle}
      backgroundStyle={[
        {
          backgroundColor: theme.colors.sheetBackground,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
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
        style={[
          styles.contentContainer,
          !showHandle && styles.hiddenHandleContentContainer,
          contentContainerStyle,
        ]}
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
    paddingBottom: spacing.lg,
  },
  hiddenHandleContentContainer: {
    paddingTop: spacing.sm + DEFAULT_HANDLE_HEIGHT,
  },
});
