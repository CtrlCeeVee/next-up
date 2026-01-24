import React from "react";
import { Image } from "react-native";

const icon = require("../../assets/icon.png");

export const AppIcon: React.FC<{ size?: number }> = ({ size = 32 }) => {
  return <Image source={icon} style={{ width: size, height: size }} />;
};
