import loadable from "@loadable/component";
import { SupervisorAccount as TournamentIcon } from "@material-ui/icons";

const TournamentDetail = loadable(() => import("pages/tournament-detail"));

export const detailLayoutRoutes = [
  {
    id: "tournament-detail",
    path: "/tournament/:id",
    name: "Tournament Detail",
    component: TournamentDetail,
    icon: TournamentIcon,
    guarded: true,
  },
];
