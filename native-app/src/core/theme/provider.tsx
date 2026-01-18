import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppThemeCoreColours, DarkTheme, LightTheme } from "./theme";

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
  System = "system",
}

interface ThemeContextType {
  theme: AppThemeCoreColours;
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@theme_mode";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.Dark);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          savedMode === ThemeMode.Light ||
          savedMode === ThemeMode.Dark ||
          savedMode === ThemeMode.System
        ) {
          setMode(ThemeMode.Dark);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch((error) => {
        console.error("Failed to save theme preference:", error);
      });
    }
  }, [mode, isLoading]);

  const isDark = useMemo(() => {
    if (mode === ThemeMode.System) {
      return systemScheme === "dark";
    }
    return mode === ThemeMode.Dark;
  }, [mode, systemScheme]);

  const theme = useMemo(() => {
    return isDark ? DarkTheme : LightTheme;
  }, [isDark]);

  const toggleTheme = () => {
    setMode((prevMode) => {
      if (prevMode === ThemeMode.Dark) return ThemeMode.Light;
      if (prevMode === ThemeMode.Light) return ThemeMode.System;
      return ThemeMode.Dark;
    });
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const value: ThemeContextType = {
    theme,
    isDark,
    themeMode: mode,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
