import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { Routes } from "./routes";
import { SplashScreen } from "../screens/splash/splash.screen";
import { AuthNavigator } from "./auth/auth.navigator";
import { AppNavigator } from "./app/app.navigator";
import { useAuthState } from "../features/auth/state";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, loading, checkSession } = useAuthState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check for existing session on app start
    checkSession().finally(() => {
      setTimeout(() => {
        setIsReady(true);
      }, 5000);
    });
  }, [checkSession]);

  // Show splash while checking session
  if (!isReady || !!loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name={Routes.Auth} component={AuthNavigator} />
      ) : (
        <Stack.Screen name={Routes.App} component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
};
