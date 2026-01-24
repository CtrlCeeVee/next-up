import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useInjection, InjectableType } from "../../di";
import { AuthService } from "../../features/auth/services";
import { ThemedText } from "../themed-text.component";
import { Button } from "../button.component";
import { Input } from "../input.component";
import { Card } from "../card.component";
import { Icon } from "../../icons";
import { useTheme } from "../../core/theme";
import { GlobalStyles, spacing, gap, roundingLarge } from "../../core/styles";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBack,
}) => {
  const { theme } = useTheme();
  const authService = useInjection<AuthService>(InjectableType.AuthService);
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Card style={styles.card}>
          {/* Success Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.success + "20" },
              ]}
            >
              <Icon name="check-circle" size={32} color={theme.colors.success} />
            </View>
            <ThemedText styleType="Subheader" style={styles.title}>
              Check Your Email
            </ThemedText>
            <ThemedText styleType="Body" style={styles.subtitle}>
              We've sent a password reset link to
            </ThemedText>
            <ThemedText
              styleType="BodyMedium"
              style={[styles.email, { color: theme.colors.primary }]}
            >
              {email}
            </ThemedText>
          </View>

          {/* Instructions */}
          <View
            style={[
              styles.instructions,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <ThemedText styleType="BodySmall" style={styles.instructionsText}>
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </ThemedText>
          </View>

          {/* Back Button */}
          <Button
            text="Back to Sign In"
            onPress={onBack}
            leftIcon="arrow-left"
          />
        </Card>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
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
            <Icon name="mail" size={32} color={theme.colors.primary} />
          </View>
          <ThemedText styleType="Subheader" style={styles.title}>
            Reset Password
          </ThemedText>
          <ThemedText styleType="Body" style={styles.subtitle}>
            Enter your email and we'll send you a reset link
          </ThemedText>
        </View>

        {/* Error Message */}
        {error && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: theme.colors.error + "20" },
            ]}
          >
            <Icon name="alert-circle" size={16} color={theme.colors.error} />
            <ThemedText
              styleType="BodySmall"
              style={[styles.errorText, { color: theme.colors.error }]}
            >
              {error}
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

          <Button
            text="Send Reset Link"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          />
        </View>

        {/* Back to Sign In */}
        <View style={styles.footer}>
          <Button
            text="Back to Sign In"
            variant="link"
            onPress={onBack}
            leftIcon="arrow-left"
            disabled={loading}
          />
        </View>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    ...GlobalStyles.padding,
    marginHorizontal: spacing.lg,
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
  email: {
    marginTop: spacing.sm,
    fontWeight: "600",
  },
  instructions: {
    borderRadius: roundingLarge,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  instructionsText: {
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
  footer: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
});
