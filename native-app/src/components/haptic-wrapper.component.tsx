import { Platform, StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";

export const HapticWrapper = ({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const handlePress = async () => {
    if (Platform.OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Toggle_On
      );
    }

    onPress();
  };

  return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;
};
