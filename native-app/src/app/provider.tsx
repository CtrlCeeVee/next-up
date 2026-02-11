import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { App } from "./app";

/**
 * App Provider
 * 
 * Note: Services are automatically initialized when the app loads
 * via the import in src/index.ts
 */
export const AppProvider = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  );
};
