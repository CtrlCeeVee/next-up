import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Icon } from "../icons";
import { useTheme } from "../core/theme";

export const SettingsButton = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    settingsButton: {
      alignItems: "flex-end",
    },
    settingsButtonIcon: {
      opacity: 0.4,
    },
  });

  return (
    <View style={styles.settingsButton}>
      <TouchableOpacity onPress={() => {}}>
        <Icon
          name="settings"
          size={24}
          color={theme.colors.text}
          style={styles.settingsButtonIcon}
        />
      </TouchableOpacity>
    </View>
  );
};
