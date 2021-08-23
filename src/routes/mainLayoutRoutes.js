import loadable from "@loadable/component";
import {
  Dashboard as DashboardIcon,
  SupervisorAccount as TournamentIcon,
} from "@material-ui/icons";

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

// Admin Detail
const AdminGames = loadable(() => import("pages/admin/games"));
const AdminGamesNew = loadable(() => import("pages/admin/games/new"));
const AdminUsers = loadable(() => import("pages/admin/users"));

// Tournament Detail
const TournamentSave = loadable(() => import("pages/tournament-save"));

// Paring
const Pairing = loadable(() => import("pages/pairing"));
const BracketPairing = loadable(() => import("pages/bracket-pairing"));

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
    sidebar: false,
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
  {
    id: "admin-games",
    path: "/admin/games",
    name: "Admin Games",
    component: AdminGames,
    guarded: true,
    redirectToSignIn: true,
    adminAccess: true,
  },
  {
    id: "admin-games-new",
    path: "/admin/games/new",
    name: "Admin Games New",
    component: AdminGamesNew,
    guarded: true,
    redirectToSignIn: true,
    adminAccess: true,
  },
  {
    id: "admin-users",
    path: "/admin/users",
    name: "Admin Users",
    component: AdminUsers,
    guarded: true,
    redirectToSignIn: true,
    adminAccess: true,
  },
  {
    id: "bracket-pairing",
    path: "/tournament/:tournamentId/:roundId/pairing",
    name: "BracketPairing",
    component: BracketPairing,
    icon: TournamentIcon,
    guarded: true,
    redirectToSignIn: true,
  },
  {
    id: "pairing",
    path: "/tournament/:tournamentId/:bracketId/:roundId/pairing",
    name: "Pairing",
    component: Pairing,
    icon: TournamentIcon,
    guarded: true,
    redirectToSignIn: true,
  },
  {
    id: "tournament-create",
    path: "/tournament-save",
    name: "Tournament Create",
    component: TournamentSave,
    icon: TournamentIcon,
    guarded: true,
    redirectToSignIn: true,
    adminAccess: true,
  },
  {
    id: "tournament-update",
    path: "/tournament-save/:id",
    name: "Tournament Update",
    component: TournamentSave,
    icon: TournamentIcon,
    guarded: true,
    redirectToSignIn: true,
    adminAccess: true,
  },
];
