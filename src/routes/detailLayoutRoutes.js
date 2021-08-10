import loadable from "@loadable/component";
import { SupervisorAccount as TournamentIcon } from "@material-ui/icons";

// Admin Detail
const AdminGames = loadable(() => import("pages/admin/games"));
const AdminGamesNew = loadable(() => import("pages/admin/games/new"));
const AdminUsers = loadable(() => import("pages/admin/users"));

// Tournament Detail
const TournamentSave = loadable(() => import("pages/tournament-save"));

// Paring
const Pairing = loadable(() => import("pages/pairing"));

export const detailLayoutRoutes = [
  // Admin Detail
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
