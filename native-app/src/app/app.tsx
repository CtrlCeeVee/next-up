import React from "react";
import { ThemeProvider } from "../core/theme";
import { Screen } from "./screen";

export const App = () => {
  return (
    <ThemeProvider>
      <Screen />
    </ThemeProvider>
  );
};
