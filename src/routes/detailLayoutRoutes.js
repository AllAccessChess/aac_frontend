import loadable from "@loadable/component";
import { SupervisorAccount as TournamentIcon } from "@material-ui/icons";

const TournamentDetail = loadable(() => import("pages/tournament-detail"));
const Pairing = loadable(() => import("pages/pairing"));

export const detailLayoutRoutes = [
  {
    id: "tournament-detail",
    path: "/tournament/:id",
    name: "Tournament Detail",
    component: TournamentDetail,
    icon: TournamentIcon,
    guarded: true,
  },
  {
    id: "pairing",
    path: "/tournament/:tournamentId/round/:roundId/pairing",
    name: "Pairing",
    component: Pairing,
    icon: TournamentIcon,
    guarded: true,
  },
];
