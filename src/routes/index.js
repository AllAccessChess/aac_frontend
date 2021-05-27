import async from "../components/Async";

// Guards
// const AuthGuard = async(() => import("../components/AuthGuard"));

// Auth components
const Page404 = async(() => import("../pages/auth/Page404"));
const Page500 = async(() => import("../pages/auth/Page500"));

// Main components
const Account = async(() => import("../pages/account"));
const Tournaments = async(() => import("../pages/tournaments"));

const authRoutes = {
  id: "Auth",
  path: "/auth",
  //   icon: <Users />,
  children: [
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404,
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500,
    },
  ],
  component: null,
};

const accountRoute = {
  id: "Account",
  path: "/account",
  name: "Account",
  component: Account,
  //   guard: AuthGuard,
};

const tournamentRoute = {
  id: "Tournament",
  path: "/",
  name: "Tournament",
  component: Tournaments,
  //   guard: AuthGuard,
};

// Routes using the Dashboard layout
export const mainLayoutRoutes = [accountRoute, tournamentRoute];

// Routes using the Auth layout
export const authLayoutRoutes = [authRoutes];
