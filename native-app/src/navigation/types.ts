import type { NavigatorScreenParams } from "@react-navigation/native";
import { Routes } from "./routes";

// Auth Stack Param List
export type AuthStackParamList = {
  [Routes.SignIn]: undefined;
  [Routes.SignUp]: undefined;
  [Routes.ForgotPassword]: undefined;
  [Routes.ResetPassword]: undefined;
};

// Leagues Stack Param List
export type LeaguesStackParamList = {
  [Routes.BrowseLeagues]: undefined;
  [Routes.LeagueDetail]: { leagueId: number };
  [Routes.LeagueNight]: { leagueId: number; nightId: string };
  [Routes.Leaderboard]: { leagueId: number };
};

// Profile Stack Param List
export type ProfileStackParamList = {
  [Routes.MyProfile]: undefined;
  [Routes.PublicProfile]: { username: string };
};

// More/Info Stack Param List
export type MoreStackParamList = {
  [Routes.About]: undefined;
  [Routes.Contact]: undefined;
  [Routes.Privacy]: undefined;
  [Routes.Terms]: undefined;
  [Routes.Dashboard]: undefined;
};

// App Tab Param List
export type AppTabParamList = {
  [Routes.Home]: undefined;
  [Routes.Leagues]: NavigatorScreenParams<LeaguesStackParamList>;
  [Routes.Profile]: NavigatorScreenParams<ProfileStackParamList>;
  [Routes.Stats]: undefined;
  [Routes.More]: NavigatorScreenParams<MoreStackParamList>;
};

// Root Stack Param List
export type RootStackParamList = {
  [Routes.Splash]: undefined;
  [Routes.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [Routes.App]: NavigatorScreenParams<AppTabParamList>;
};

// Global type augmentation for type-safe navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
