import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";
import { LeagueMember } from "../../membership/types";

export const LeagueMemberIconComponent = ({
  member,
  size = 40,
  style,
}: {
  member: LeagueMember;
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
        uri:
          member.imageUrl ||
          `https://ui-avatars.com/api/?name=${member.name}&size=100`,
      }}
      style={[styles.image, style]}
    />
  );
};
