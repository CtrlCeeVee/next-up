import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useAuthState } from "../../features/auth/state";
import { ThemedText } from "../themed-text.component";
import { Button } from "../button.component";
import { Input } from "../input.component";
import { Card } from "../card.component";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import { GlobalStyles, padding, TextStyle, spacing, gap, roundingLarge } from "../../core/styles";
import { AppIcon } from "../app-icon.component";

interface SignInFormProps {
  onToggle: () => void;
  onForgotPassword: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onToggle,
  onForgotPassword,
}) => {
  const { theme } = useTheme();
  const { signIn, loading, error: authError } = useAuthState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    }
  };

  const displayError = error || authError;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Card style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer]}>
            {/* <Icon name="user" size={32} color={theme.colors.primary} /> */}
            <AppIcon size={48} />
          </View>
          <ThemedText textStyle={TextStyle.Header}>Welcome Back</ThemedText>
          <ThemedText textStyle={TextStyle.Body}>
            Sign in to continue your pickleball journey
          </ThemedText>
        </View>

        {/* Error Message */}
        {displayError && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: theme.colors.error + "20" },
            ]}
          >
            <Icon name="alert-circle" size={16} color={theme.colors.error} />
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={[styles.errorText, { color: theme.colors.error }]}
            >
              {displayError}
            </ThemedText>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            leftIcon="lock"
            editable={!loading}
          />

          <Button
            text="Forgot Password?"
            variant="link"
            onPress={onForgotPassword}
            style={styles.forgotButton}
            disabled={loading}
          />

          <Button
            text="Sign In"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>
      </Card>
      <View style={styles.footer}>
        <ThemedText textStyle={TextStyle.Body}>
          Don't have an account?{" "}
        </ThemedText>
        <Button
          text="Create one here"
          variant="link"
          onPress={onToggle}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: padding,
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
    opacity: 0.7,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: roundingLarge,
    marginBottom: spacing.lg,
    gap: gap.sm,
  },
  errorText: {
    flex: 1,
  },
  form: {
    gap: gap.lg,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -spacing.sm,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
});
