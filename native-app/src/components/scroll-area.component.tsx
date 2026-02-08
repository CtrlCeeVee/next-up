import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import { gap, padding } from "../core";
import { GlobalStyles, spacing } from "../core/styles";
import { HoverActionsComponent } from "./hover-actions.component";
import { useState } from "react";

/**
 * ScrollArea provides a scrollable container with optional hover actions.
 * When hover actions are provided, the component automatically measures their height
 * and adds appropriate bottom padding to ensure scroll content is not hidden.
 */
export const ScrollArea = ({
  children,
  style,
  hoverActions,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  hoverActions?: React.ReactNode;
}) => {
  const [hoverActionsHeight, setHoverActionsHeight] = useState(0);

  const handleHoverActionsLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setHoverActionsHeight(height);
  };

  return (
    <>
      {hoverActions && (
        <HoverActionsComponent onLayout={handleHoverActionsLayout}>
          {hoverActions}
        </HoverActionsComponent>
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: hoverActionsHeight + spacing.md,
        }}
      >
        <View style={[styles.content, style]}>{children}</View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    ...GlobalStyles.column,
    padding: padding,
    gap: gap.lg,
  },
});
