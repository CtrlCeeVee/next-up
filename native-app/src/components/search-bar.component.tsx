import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useTheme } from "../core/theme";
import { rounding, padding, gap } from "../core/styles/global";
import { PrimaryFont } from "../core/font";
import { Icon } from "../icons";

interface SearchBarProps extends Omit<TextInputProps, "style"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  containerStyle,
  style,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    onChangeText("");
    Keyboard.dismiss();
    inputRef.current?.blur();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.inputBackground,
          borderColor: isFocused
            ? theme.colors.primary
            : theme.colors.text + "20",
        },
        containerStyle,
      ]}
    >
      <View style={styles.iconContainer}>
        <Icon
          name="search"
          size={20}
          color={isFocused ? theme.colors.primary : theme.colors.text + "60"}
        />
      </View>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            fontFamily: PrimaryFont.Regular,
          },
          style,
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text + "60"}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={[
            styles.clearButton,
            { backgroundColor: theme.colors.text + "40" },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="x" size={14} color={theme.colors.background} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: rounding,
    padding: padding,
    gap: gap.sm,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    margin: 0,
    minHeight: 20,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
