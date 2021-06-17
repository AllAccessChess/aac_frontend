import loadable from "@loadable/component";
import {
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  SupervisorAccount as TournamentIcon,
  AttachMoney as PrizeIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";

// Main Layout Pages
const Account = loadable(() => import("pages/account"));
const Prizes = loadable(() => import("pages/prizes"));
const Settings = loadable(() => import("pages/settings"));
const Tournaments = loadable(() => import("pages/tournaments"));
const Dashboard = loadable(() => import("pages/dashboard"));

// Main Layout Routes
export const mainLayoutRoutes = [
  {
    id: "dashboard",
    path: "/",
    name: "Dashboard",
    icon: DashboardIcon,
    component: Dashboard,
  },
  {
    id: "tournament-list",
    path: "/tournaments",
    name: "Tournament List",
    component: Tournaments,
    icon: TournamentIcon,
  },
  {
    id: "account",
    path: "/account",
    name: "Account",
    icon: AccountIcon,
    component: Account,
    guarded: true,
  },
  {
    id: "Prizes",
    path: "/prizes",
    name: "My Prizes",
    icon: PrizeIcon,
    component: Prizes,
    guarded: true,
  },
  {
    id: "Settings",
    path: "/settings",
    name: "Settings",
    icon: SettingsIcon,
    component: Settings,
    guarded: true,
  },
];
