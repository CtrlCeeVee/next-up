import React from "react";
import { View, StyleSheet } from "react-native";

export const PickleBall = () => {
  return <View style={styles.ball} />;
};

const styles = StyleSheet.create({
  ball: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#D4FC1E",
    borderWidth: 2,
    borderColor: "#9E9D24",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
