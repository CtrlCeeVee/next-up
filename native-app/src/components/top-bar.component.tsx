import { StyleSheet, View } from "react-native";
import { padding, paddingSmall, spacing } from "../core/styles/global";
import { BackChevron } from "./back-chevron.component";
import { SettingsButton } from "./settings-button.component";

interface TabBarComponentProps {
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  children?: React.ReactNode;
}

export const TobBar = ({
  showBackButton = true,
  showSettingsButton = true,
  children,
}: TabBarComponentProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonBar}>
        {showBackButton && <BackChevron />}
        {showSettingsButton && <SettingsButton />}
      </View>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  buttonBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: padding,
  },
  childrenContainer: {
    width: "100%",
    paddingHorizontal: padding,
    marginBottom: spacing.md,
    paddingVertical: paddingSmall,
  },
});
