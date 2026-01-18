import React, { useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useAuthState } from "../../features/auth/state";
import { ThemedText } from "../themed-text.component";
import { Button } from "../button.component";
import { Input } from "../input.component";
import { Card } from "../card.component";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import { GlobalStyles } from "../../core/styles";
import { Picker } from "@react-native-picker/picker";

interface SignUpFormProps {
  onToggle: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onToggle }) => {
  const { theme } = useTheme();
  const { signUp, loading, error: authError } = useAuthState();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await signUp({
        email,
        password,
        firstName,
        lastName,
        skillLevel,
      });
      setSuccess("Account created! Please check your email for verification.");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
  };

  const displayError = error || authError;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primaryFaded },
              ]}
            >
              <Icon name="user-add" size={32} color={theme.colors.primary} />
            </View>
            <ThemedText styleType="Subheader" style={styles.title}>
              Join Next-Up
            </ThemedText>
            <ThemedText styleType="Body" style={styles.subtitle}>
              Create your account and start your pickleball journey
            </ThemedText>
          </View>

          {/* Error Message */}
          {displayError && (
            <View
              style={[
                styles.messageContainer,
                { backgroundColor: theme.colors.error + "20" },
              ]}
            >
              <Icon name="alert-circle" size={16} color={theme.colors.error} />
              <ThemedText
                styleType="BodySmall"
                style={[styles.messageText, { color: theme.colors.error }]}
              >
                {displayError}
              </ThemedText>
            </View>
          )}

          {/* Success Message */}
          {success && (
            <View
              style={[
                styles.messageContainer,
                { backgroundColor: theme.colors.success + "20" },
              ]}
            >
              <Icon name="check-circle" size={16} color={theme.colors.success} />
              <ThemedText
                styleType="BodySmall"
                style={[styles.messageText, { color: theme.colors.success }]}
              >
                {success}
              </ThemedText>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.row}>
              <Input
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                leftIcon="user"
                style={styles.halfInput}
                editable={!loading}
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                leftIcon="user"
                style={styles.halfInput}
                editable={!loading}
              />
            </View>

            <Input
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="mail"
              editable={!loading}
            />

            <Input
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              leftIcon="lock"
              editable={!loading}
            />

            <Input
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              leftIcon="shield"
              editable={!loading}
            />

            {/* Skill Level Picker */}
            <View style={styles.pickerContainer}>
              <ThemedText styleType="BodyMedium" style={styles.pickerLabel}>
                Skill Level
              </ThemedText>
              <View
                style={[
                  styles.pickerWrapper,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                ]}
              >
                <Icon name="trophy" size={20} color={theme.colors.text} style={styles.pickerIcon} />
                <Picker
                  selectedValue={skillLevel}
                  onValueChange={(itemValue) => setSkillLevel(itemValue)}
                  style={[styles.picker, { color: theme.colors.text }]}
                  enabled={!loading}
                >
                  <Picker.Item label="🌱 Beginner - New to pickleball" value="Beginner" />
                  <Picker.Item label="🎯 Intermediate - Some experience" value="Intermediate" />
                  <Picker.Item label="🏆 Advanced - Experienced player" value="Advanced" />
                </Picker>
              </View>
            </View>

            <Button
              text="Create Account"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            />
          </View>

          {/* Toggle to Sign In */}
          <View style={styles.footer}>
            <ThemedText styleType="Body">Already have an account? </ThemedText>
            <Button
              text="Sign in here"
              variant="link"
              onPress={onToggle}
              disabled={loading}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 24,
  },
  card: {
    ...GlobalStyles.padding,
    marginHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  messageText: {
    flex: 1,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  pickerContainer: {
    gap: 8,
  },
  pickerLabel: {
    opacity: 0.7,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 12,
  },
  pickerIcon: {
    marginRight: 8,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
});
