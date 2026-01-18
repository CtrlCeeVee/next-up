import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types";
import { Routes } from "../routes";
import { SignInScreen } from "../../screens/auth/sign-in.screen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.SignIn} component={SignInScreen} />
    </Stack.Navigator>
  );
};
