import loadable from "@loadable/component";
import {
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  SupervisorAccount as TournamentIcon,
  AttachMoney as PrizeIcon,
  Settings as SettingsIcon,
  SupervisorAccount as AdminIcon,
  Adb as BotIcon,
} from "@material-ui/icons";

// Main Layout Pages
const Account = loadable(() => import("pages/account"));
const Admin = loadable(() => import("pages/admin"));
const Prizes = loadable(() => import("pages/prizes"));
const Settings = loadable(() => import("pages/settings"));
const Tournaments = loadable(() => import("pages/tournaments"));
const Dashboard = loadable(() => import("pages/dashboard"));
const Analysis = loadable(() => import("pages/analysis"));

// Main Layout Routes
export const mainLayoutRoutes = [
  {
    id: "account",
    path: "/account",
    name: "Account",
    icon: AccountIcon,
    component: Account,
    guarded: true,
    redirectToSignIn: true,
    sidebar: true,
  },
  {
    id: "admin",
    path: "/admin",
    name: "Admin Panel",
    icon: AdminIcon,
    component: Admin,
    guarded: true,
    redirectToSignIn: true,
    adminAccess: true,
    sidebar: true,
  },
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
    icon: TournamentIcon,
    guarded: true,
    sidebar: true,
  },
  {
    id: "Prizes",
    path: "/prizes",
    name: "My Prizes",
    icon: PrizeIcon,
    component: Prizes,
    guarded: true,
    redirectToSignIn: true,
    sidebar: true,
  },
  {
    id: "Settings",
    path: "/settings",
    name: "Settings",
    icon: SettingsIcon,
    component: Settings,
    guarded: true,
    redirectToSignIn: true,
    sidebar: true,
  },
  {
    id: "Analysis",
    path: "/analysis",
    name: "Analysis",
    icon: BotIcon,
    component: Analysis,
    guarded: false,
    sidebar: true,
  },
  {
    id: "Analysis",
    path: "/analysis/:id",
    name: "Analysis",
    icon: BotIcon,
    component: Analysis,
    guarded: true,
    redirectToSignIn: true,
    sidebar: false,
  },
];
