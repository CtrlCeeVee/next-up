import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { useTheme } from "../core/theme";
import { rounding, padding, paddingSmall } from "../core/styles/global";
import { PrimaryFont } from "../core/font";
import { Icon, IconName } from "../icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: IconName;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  style,
  ...textInputProps
}) => {
  const { theme, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
              fontFamily: PrimaryFont.Medium,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Icon
              name={leftIcon}
              size={20}
              color={
                isFocused ? theme.colors.primary : theme.colors.text + "60"
              }
            />
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.inputBackground,
              borderColor: error
                ? "#ef4444"
                : isFocused
                  ? theme.colors.primary
                  : theme.colors.text + "20",
              color: theme.colors.text,
              fontFamily: PrimaryFont.Regular,
              paddingLeft: leftIcon ? 44 : padding,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.text + "60"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
      </View>
      {error && (
        <Text
          style={[
            styles.error,
            {
              color: "#ef4444",
              fontFamily: PrimaryFont.Regular,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    marginBottom: paddingSmall,
  },
  inputContainer: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: rounding,
    padding: padding,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: paddingSmall / 2,
  },
});
