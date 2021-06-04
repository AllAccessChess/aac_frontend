import React from "react";
import async from "../components/Async";

// Icons
import {
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  SupervisorAccount as TournamentIcon,
  AttachMoney as PrizeIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";

// Guards
const AuthGuard = async(() => import("../components/AuthGuard"));

// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const SignUp = async(() => import("../pages/auth/SignUp"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));

// Main components
const Account = async(() => import("../pages/account"));
const Prizes = async(() => import("../pages/prizes"));
const Settings = async(() => import("../pages/settings"));
const Tournaments = async(() => import("../pages/tournaments"));
const TournamentDetail = async(() => import("../pages/tournaments/Detail"));
const TournamentPlay = async(() => import("../pages/tournaments/Play"));
const Dashboard = async(() => import("../pages/dashboard"));

const authRoutes = {
  id: "Auth",
  path: "/auth",
  //   icon: <Users />,
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn,
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp,
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword,
    },
  ],
  component: null,
};

const tournamentRoute = {
  id: "Tournaments",
  path: "/tournaments",
  name: "My Tournaments",
  component: null,
  icon: <TournamentIcon />,
  // guard: AuthGuard,
  children: [
    {
      path: "/tournaments",
      name: "Tournaments",
      component: Tournaments,
    },
    {
      path: "/tournaments/:id",
      name: "Tournament Detail",
      component: TournamentDetail,
    },
    {
      path: "/tournaments/:id/play",
      name: "Tournament Play",
      component: TournamentPlay,
    },
  ],
};

const dashboardRoute = {
  id: "Dashboard",
  path: "/",
  name: "Dashboard",
  component: Dashboard,
  icon: <DashboardIcon />,
  // guard: AuthGuard,
};

const accountRoute = {
  id: "Account",
  path: "/account",
  name: "Account",
  component: Account,
  guard: AuthGuard,
  guarded: true,
  icon: <AccountIcon />,
};

const prizesRoute = {
  id: "Prizes",
  path: "/prizes",
  name: "My Prizes",
  component: Prizes,
  icon: <PrizeIcon />,
  guarded: true,
  guard: AuthGuard,
};

const settingsRoute = {
  id: "Settings",
  path: "/settings",
  name: "Settings",
  icon: <SettingsIcon />,
  component: Settings,
  guarded: true,
  guard: AuthGuard,
};

// Routes using the Dashboard layout
export const mainLayoutRoutes = [
  accountRoute,
  dashboardRoute,
  tournamentRoute,
  prizesRoute,
  settingsRoute,
];

// Routes using the Auth layout
export const authLayoutRoutes = [authRoutes];
