import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";
import { LeagueMember } from "../../membership/types";

export const LeagueMemberIconComponent = ({
  iconUrl,
  name,
  size = 40,
  style,
}: {
  name: string;
  iconUrl?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
}) => {
  const styles = StyleSheet.create({
    image: {
      width: size,
      height: size,
      borderRadius: 20,
    },
  });

  return (
    <Image
      source={{
        uri: iconUrl || `https://ui-avatars.com/api/?name=${name}&size=100`,
      }}
      style={[styles.image, style]}
    />
  );
};
