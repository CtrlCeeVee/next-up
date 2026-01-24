/**
 * Dropdown Component
 *
 * A reusable dropdown component with theme-based styling that replaces the native Picker.
 * Opens in a modal overlay with a scrollable list of options.
 *
 * @example
 * ```tsx
 * <Dropdown
 *   label="Skill Level"
 *   value={selectedValue}
 *   onChange={(value) => setSelectedValue(value)}
 *   placeholder="Select an option"
 *   disabled={false}
 *   error="This field is required"
 * >
 *   <Dropdown.Item label="Beginner" value="beginner" />
 *   <Dropdown.Item label="Intermediate" value="intermediate" />
 *   <Dropdown.Item label="Advanced" value="advanced" />
 * </Dropdown>
 * ```
 */

import React, { useState, ReactElement } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from "react-native";
import { useTheme } from "../core/theme";
import { rounding, padding, paddingSmall, shadow } from "../core/styles/global";
import { PrimaryFont } from "../core/font";
import { Icon } from "../icons";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  error?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  onChange: (value: string) => void;
  children: ReactElement<DropdownItemProps> | ReactElement<DropdownItemProps>[];
}

interface DropdownItemProps {
  label: string;
  value: string;
}

const DropdownItem: React.FC<DropdownItemProps> = () => {
  // This component doesn't render anything - it's just used to pass props
  return null;
};

export const Dropdown: React.FC<DropdownProps> & {
  Item: React.FC<DropdownItemProps>;
} = ({
  label,
  error,
  value,
  placeholder = "Select an option",
  disabled = false,
  containerStyle,
  onChange,
  children,
}) => {
  const { theme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Extract options from children
  const options: DropdownOption[] =
    React.Children.map(children, (child: ReactElement<DropdownItemProps>) => ({
      label: child.props.label,
      value: child.props.value,
    })) || [];

  // Find selected label
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsModalVisible(false);
  };

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

      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: error ? theme.colors.error : theme.colors.text + "20",
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={() => !disabled && setIsModalVisible(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text
          style={[
            styles.selectorText,
            {
              color: selectedOption
                ? theme.colors.text
                : theme.colors.text + "60",
              fontFamily: PrimaryFont.Regular,
            },
          ]}
        >
          {displayValue}
        </Text>
        <Icon name="chevron-down" size={20} color={theme.colors.text + "60"} />
      </TouchableOpacity>

      {error && (
        <Text
          style={[
            styles.error,
            {
              color: theme.colors.error,
              fontFamily: PrimaryFont.Regular,
            },
          ]}
        >
          {error}
        </Text>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.border,
              },
              shadow.medium,
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View
              style={[
                styles.modalHeader,
                {
                  borderBottomColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: theme.colors.text,
                    fontFamily: PrimaryFont.Medium,
                  },
                ]}
              >
                {label || "Select an option"}
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary + "20"
                          : "transparent",
                      },
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected
                            ? theme.colors.primary
                            : theme.colors.text,
                          fontFamily: isSelected
                            ? PrimaryFont.Medium
                            : PrimaryFont.Regular,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Icon
                        name="check-circle"
                        size={20}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

Dropdown.Item = DropdownItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    marginBottom: paddingSmall,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: rounding,
    padding: padding,
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
  },
  error: {
    fontSize: 12,
    marginTop: paddingSmall / 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: padding * 2,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "70%",
    borderRadius: rounding,
    borderWidth: 1,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: padding,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    flex: 1,
  },
  closeButton: {
    padding: paddingSmall / 2,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: padding,
    borderRadius: rounding / 2,
    marginHorizontal: paddingSmall,
    marginVertical: paddingSmall / 2,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});
