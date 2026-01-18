import React from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import { useTheme } from "../core/theme";

interface RefreshProps {
  children: React.ReactNode;
  refreshing: boolean;
  onRefresh: () => void;
}

export const Refresh: React.FC<RefreshProps> = ({
  children,
  refreshing,
  onRefresh,
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
