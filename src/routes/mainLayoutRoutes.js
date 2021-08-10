import loadable from "@loadable/component";
import { Dashboard as DashboardIcon } from "@material-ui/icons";

import {
  DollarIcon,
  GearIcon,
  KnightIcon,
  MagnifierIcon,
  PersonIcon,
  PersonShieldIcon,
} from "components/icons";

// Main Layout Pages
const Account = loadable(() => import("pages/account"));
const Admin = loadable(() => import("pages/admin"));
const Prizes = loadable(() => import("pages/prizes"));
const Settings = loadable(() => import("pages/settings"));
const Tournaments = loadable(() => import("pages/tournaments"));
const Dashboard = loadable(() => import("pages/dashboard"));
const Analysis = loadable(() => import("pages/analysis"));
const TournamentDetail = loadable(() => import("pages/tournament-detail"));

// Main Layout Routes
export const mainLayoutRoutes = [
  {
    id: "dashboard",
    path: "/",
    name: "Dashboard",
    icon: DashboardIcon,
    component: Dashboard,
    guarded: true,
    redirectToSignIn: true,
    sidebar: true,
  },
  {
    id: "tournament-list",
    path: "/tournaments",
    name: "Tournaments",
    component: Tournaments,
    icon: KnightIcon,
    guarded: true,
    sidebar: true,
  },
  {
    id: "tournament-detail",
    path: "/tournament/:id",
    name: "Tournament Detail",
    component: TournamentDetail,
    icon: KnightIcon,
    guarded: true,
  },
  {
    id: "account",
    path: "/account",
    name: "Profile",
    icon: PersonIcon,
    component: Account,
    guarded: true,
    redirectToSignIn: true,
    sidebar: true,
  },
  {
    id: "admin",
    path: "/admin",
    name: "Admin Panel",
    icon: PersonShieldIcon,
    component: Admin,
    guarded: true,
    redirectToSignIn: true,
    adminAccess: true,
    sidebar: true,
  },
  {
    id: "Prizes",
    path: "/prizes",
    name: "My Prizes",
    icon: DollarIcon,
    component: Prizes,
    guarded: true,
    redirectToSignIn: true,
    sidebar: true,
  },
  {
    id: "Analysis",
    path: "/analysis",
    name: "Analysis",
    icon: MagnifierIcon,
    component: Analysis,
    guarded: false,
    sidebar: true,
  },
  {
    id: "Analysis",
    path: "/analysis/:id",
    name: "Analysis",
    icon: MagnifierIcon,
    component: Analysis,
    guarded: true,
    redirectToSignIn: true,
    sidebar: false,
  },
  {
    id: "Settings",
    path: "/settings",
    name: "Settings",
    icon: GearIcon,
    component: Settings,
    guarded: true,
    redirectToSignIn: true,
    sidebar: true,
  },
];
