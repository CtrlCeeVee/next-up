import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../core/theme";
import { useAppFonts } from "../core/font";
import { NavigationProvider } from "../navigation";
import { SplashScreen } from "../screens/splash/splash.screen";
import { ToastContainer } from "../components/toast";
import { ModalManager } from "../components/modal";

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
        console.warn(
          "Fonts taking too long to load. Showing app with system fonts."
        );
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
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
          <ToastContainer />
          <ModalManager />
          <StatusBar
            barStyle={isDark ? "light-content" : "dark-content"}
            backgroundColor="transparent"
            translucent
          />
          <NavigationProvider />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
});
