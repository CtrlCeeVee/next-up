import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SignInForm, SignUpForm, ForgotPasswordForm } from "../../components/auth";
import { ScreenContainer } from "../../components";

type AuthView = "sign-in" | "sign-up" | "forgot-password";

export const SignInScreen = () => {
  const [view, setView] = useState<AuthView>("sign-in");

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {view === "sign-in" && (
          <SignInForm
            onToggle={() => setView("sign-up")}
            onForgotPassword={() => setView("forgot-password")}
          />
        )}
        {view === "sign-up" && (
          <SignUpForm onToggle={() => setView("sign-in")} />
        )}
        {view === "forgot-password" && (
          <ForgotPasswordForm onBack={() => setView("sign-in")} />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
