import React from "react";
import { App } from "./app";

/**
 * App Provider
 * 
 * Note: Services are automatically initialized when the app loads
 * via the import in src/index.ts
 */
export const AppProvider = () => {
  return <App />;
};
