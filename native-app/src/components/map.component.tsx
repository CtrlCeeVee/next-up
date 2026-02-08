import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { rounding } from "../core";

export const Map = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  return (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      ></MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    borderRadius: rounding,
    width: "100%",
    height: 200,
  },
});
