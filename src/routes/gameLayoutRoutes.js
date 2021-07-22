import loadable from "@loadable/component";

const Match = loadable(() => import("pages/match"));
const Example = loadable(() => import("pages/example"));

export const gameLayoutRoutes = [
  {
    id: "match",
    path: "/match",
    name: "Match",
    component: Match,
    guarded: true,
    redirectToSignIn: true,
  },
  {
    id: "match",
    path: "/match/:id",
    name: "Match",
    component: Match,
    guarded: true,
    redirectToSignIn: true,
  },
  {
    id: "spectate",
    path: "/spectate/:id",
    name: "Spectate",
    component: Match,
    guarded: true,
    redirectToSignIn: true,
  },
  {
    id: "spectate-td",
    path: "/spectate/:id/td",
    name: "Director",
    component: Match,
    guarded: true,
    redirectToSignIn: true,
  },
  {
    id: "example",
    path: "/example",
    name: "Example",
    component: Example,
    guarded: true,
    redirectToSignIn: true,
  },
];
