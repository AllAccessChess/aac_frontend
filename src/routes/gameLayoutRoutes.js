import loadable from "@loadable/component";

const Match = loadable(() => import("pages/match"));

export const gameLayoutRoutes = [
  {
    id: "match",
    path: "/match",
    name: "Match",
    component: Match,
    guarded: true,
  },
  {
    id: "spectate",
    path: "/spectate/:id",
    name: "Spectate",
    component: Match,
    guarded: true,
  },
];
