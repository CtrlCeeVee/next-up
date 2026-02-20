import React, { useEffect, useState } from "react";
import {
  ColorValue,
  FlatList,
  RefreshControl,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTheme } from "../core/theme";

interface RefreshProps<T> {
  data: T[];
  renderItem: (item: { item: T; index: number }) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

export const Refresh = <T,>({
  data,
  renderItem,
  keyExtractor,
  refreshing,
  onRefresh,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  contentContainerStyle,
  style,
  onEndReached,
  onEndReachedThreshold = 0.5,
}: RefreshProps<T>) => {
  const { theme } = useTheme();

  // Workaround for RN new-arch bug (facebook/react-native#53987): tintColor is
  // ignored on first render because updateProps fires before the initial layout.
  // Deferring the color assignment forces a second prop update after layout.
  const [tintColor, setTintColor] = useState<ColorValue | undefined>(undefined);
  useEffect(() => {
    const id = setTimeout(() => setTintColor(theme.colors.primary), 100);
    return () => clearTimeout(id);
  }, [theme.colors.primary]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={tintColor}
          colors={tintColor ? [tintColor] : undefined}
        />
      }
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
    />
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
