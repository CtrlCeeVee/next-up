import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Icon } from "../icons";
import { useTheme } from "../core/theme";
import { paddingSmall, TextStyle } from "../core";
import { ThemedText } from "./themed-text.component";

export const BackChevron = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    backChevronContainer: {
      alignItems: "flex-start",
    },
    backChevron: {
      flexDirection: "row",
      alignItems: "center",
      gap: paddingSmall,
      opacity: 0.2,
    },
  });

  return (
    <View style={styles.backChevronContainer}>
      <TouchableOpacity
        style={styles.backChevron}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-left" size={30} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};
