import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { RootStackParamList } from "./types";
import { Routes } from "./routes";

const prefix = Linking.createURL("/");

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, "nextup://"],
  config: {
    screens: {
      [Routes.Splash]: "splash",
      [Routes.Auth]: {
        screens: {
          [Routes.SignIn]: "sign-in",
          [Routes.SignUp]: "sign-up",
          [Routes.ForgotPassword]: "forgot-password",
          [Routes.ResetPassword]: "reset-password",
        },
      },
      [Routes.App]: {
        screens: {
          [Routes.Home]: "home",
          [Routes.Leagues]: {
            screens: {
              [Routes.BrowseLeagues]: "leagues",
              [Routes.LeagueDetail]: "league/:leagueId",
              [Routes.LeagueNight]: "league/:leagueId/night/:nightId",
              [Routes.Leaderboard]: "league/:leagueId/leaderboard",
            },
          },
          [Routes.Profile]: {
            screens: {
              [Routes.MyProfile]: "profile",
              [Routes.PublicProfile]: "profile/:username",
            },
          },
          [Routes.More]: {
            screens: {
              [Routes.Dashboard]: "dashboard",
              [Routes.About]: "about",
              [Routes.Contact]: "contact",
              [Routes.Privacy]: "privacy",
              [Routes.Terms]: "terms",
            },
          },
        },
      },
    },
  },
};
