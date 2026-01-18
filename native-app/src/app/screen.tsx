import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../core/theme";
import { useAppFonts } from "../core/font";
import { NavigationProvider } from "../navigation";
import { SplashScreen } from "../screens/splash/splash.screen";
import { ToastContainer } from "../components/toast";

export const Screen = () => {
  const { theme, isDark } = useTheme();
  const fontsLoaded = useAppFonts();

  // Show splash screen while fonts are loading (with 3 second timeout)
  const [showApp, setShowApp] = React.useState(false);

  React.useEffect(() => {
    if (fontsLoaded) {
      setShowApp(true);
    } else {
      // Fallback: show app after 3 seconds even if fonts haven't loaded
      const timeout = setTimeout(() => {
        console.warn("Fonts taking too long to load. Showing app with system fonts.");
        setShowApp(true);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [fontsLoaded]);

  if (!showApp) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={theme.backgroundGradient}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
          <StatusBar
            barStyle={isDark ? "light-content" : "dark-content"}
            backgroundColor="transparent"
            translucent
          />
          <NavigationProvider />
          <ToastContainer />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
