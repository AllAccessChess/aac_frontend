import loadable from "@loadable/component";

const Match = loadable(() => import("pages/match"));

export const gameLayoutRoutes = [
  {
    id: "match",
    path: "/match/:id",
    name: "Match",
    component: Match,
    guarded: true,
  },
];
