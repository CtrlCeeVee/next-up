import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuthState } from "../../features/auth/state";
import { ThemedText } from "../themed-text.component";
import { Button } from "../button.component";
import { Input } from "../input.component";
import { Dropdown } from "../dropdown.component";
import { Card } from "../card.component";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import { GlobalStyles, padding, TextStyle, spacing, gap, roundingLarge } from "../../core/styles";
import { AppIcon } from "../app-icon.component";

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
  const [skillLevel, setSkillLevel] = useState<
    "Beginner" | "Intermediate" | "Advanced"
  >("Beginner");
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
            <View style={[styles.iconContainer]}>
              <AppIcon size={48} />
            </View>
            <ThemedText textStyle={TextStyle.Header}>Join Next-Up</ThemedText>
            <ThemedText textStyle={TextStyle.Body} style={styles.subtitle}>
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
                textStyle={TextStyle.BodySmall}
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
              <Icon
                name="check-circle"
                size={16}
                color={theme.colors.success}
              />
              <ThemedText
                textStyle={TextStyle.BodySmall}
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
                containerStyle={styles.halfInput}
                editable={!loading}
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                leftIcon="user"
                style={styles.halfInput}
                containerStyle={styles.halfInput}
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

            {/* Skill Level Dropdown */}
            <Dropdown
              label="Skill Level"
              value={skillLevel}
              onChange={(value) =>
                setSkillLevel(value as "Beginner" | "Intermediate" | "Advanced")
              }
              placeholder="Select your skill level"
              disabled={loading}
              containerStyle={styles.dropdownContainer}
            >
              <Dropdown.Item
                label="🌱 Beginner - New to pickleball"
                value="Beginner"
              />
              <Dropdown.Item
                label="🎯 Intermediate - Some experience"
                value="Intermediate"
              />
              <Dropdown.Item
                label="🏆 Advanced - Experienced player"
                value="Advanced"
              />
            </Dropdown>

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
            <ThemedText textStyle={TextStyle.Body}>
              Already have an account?{" "}
            </ThemedText>
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
    paddingHorizontal: padding,
    paddingVertical: spacing.xl,
  },
  card: {
    paddingHorizontal: padding,
    paddingVertical: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: roundingLarge,
    marginBottom: spacing.lg,
    gap: gap.sm,
  },
  messageText: {
    flex: 1,
  },
  form: {
    gap: gap.lg,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    gap: gap.md,
    width: "100%",
  },
  halfInput: {
    flex: 1,
    width: "100%",
  },
  dropdownContainer: {
    width: "100%",
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
});
