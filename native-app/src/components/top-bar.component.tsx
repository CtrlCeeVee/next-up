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
  const buttonSize = 24;

  const renderPlaceholder = () => {
    return <View style={{ width: buttonSize, height: buttonSize }}></View>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {showBackButton ? (
          <BackChevron size={buttonSize} />
        ) : (
          renderPlaceholder()
        )}
        {children ? children : renderPlaceholder()}
        {showSettingsButton ? (
          <SettingsButton size={buttonSize} />
        ) : (
          renderPlaceholder()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: padding,
  },
});
