import { LayoutChangeEvent, StyleSheet } from "react-native";
import { Container } from "./container.component";
import { padding, spacing } from "../core";

/**
 * HoverActionsComponent provides an absolutely positioned container for floating action buttons.
 * This component should be used via the ScrollArea's hoverActions prop to ensure proper
 * scroll padding is automatically applied.
 */
export const HoverActionsComponent = ({
  children,
  onLayout,
}: {
  children: React.ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
}) => {
  return (
    <Container
      column
      centerHorizontal
      grow
      style={styles.container}
      onLayout={onLayout || undefined}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    bottom: spacing.md,
    paddingHorizontal: padding,
    zIndex: 1,
  },
});
