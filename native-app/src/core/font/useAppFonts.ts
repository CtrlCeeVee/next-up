import { useFonts } from "expo-font";
import { PrimaryFont } from "./primary.font";

/**
 * Hook to load all app fonts
 * Returns true when fonts are loaded, false otherwise
 * 
 * Note: Inter font files should be placed in src/assets/fonts/inter/
 * Download from: https://fonts.google.com/specimen/Inter
 * Required files:
 * - Inter-Regular.ttf
 * - Inter-Medium.ttf
 * - Inter-SemiBold.ttf
 * - Inter-Bold.ttf
 * - Inter-Light.ttf
 * 
 * If fonts are not found, the app will use system defaults.
 */
export const useAppFonts = () => {
  try {
    const [fontsLoaded] = useFonts({
      // Primary font family (Inter)
      [PrimaryFont.Regular]: require("../../assets/fonts/inter/Inter-Regular.ttf"),
      [PrimaryFont.Medium]: require("../../assets/fonts/inter/Inter-Medium.ttf"),
      [PrimaryFont.SemiBold]: require("../../assets/fonts/inter/Inter-SemiBold.ttf"),
      [PrimaryFont.Bold]: require("../../assets/fonts/inter/Inter-Bold.ttf"),
      [PrimaryFont.Light]: require("../../assets/fonts/inter/Inter-Light.ttf"),
    });

    return fontsLoaded;
  } catch (error) {
    console.warn("Custom fonts not found. Using system defaults.");
    console.warn("Download Inter fonts from: https://fonts.google.com/specimen/Inter");
    console.warn("Place .ttf files in: src/assets/fonts/inter/");
    // Return true to allow app to continue with system fonts
    return true;
  }
};
