import async from "../components/Async";

// Guards
const AuthGuard = async(() => import("../components/AuthGuard"));

// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const SignUp = async(() => import("../pages/auth/SignUp"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));

// Main components
const Account = async(() => import("../pages/account"));
const Tournaments = async(() => import("../pages/tournaments"));
const TournamentDetail = async(() => import("../pages/tournaments/Detail"));
const TournamentPlay = async(() => import("../pages/tournaments/Play"));
const Dashboard = async(() => import("../pages/dashboard"));

const authRoutes = {
  id: "Auth",
  path: "/auth",
  //   icon: <Users />,
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn,
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp,
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword,
    },
  ],
  component: null,
};

const accountRoute = {
  id: "Account",
  path: "/account",
  name: "Account",
  component: Account,
  guard: AuthGuard,
};

const tournamentRoute = {
  id: "Tournaments",
  path: "/tournaments",
  name: "Tournaments",
  component: null,
  // guard: AuthGuard,
  children: [
    {
      path: "/tournaments",
      name: "Tournaments",
      component: Tournaments,
    },
    {
      path: "/tournaments/:id",
      name: "Tournament Detail",
      component: TournamentDetail,
    },
    {
      path: "/tournaments/:id/play",
      name: "Tournament Play",
      component: TournamentPlay,
    },
  ],
};

const dashboardRoute = {
  id: "Dashboard",
  path: "/",
  name: "dashboard",
  component: Dashboard,
  // guard: AuthGuard,
};

// Routes using the Dashboard layout
export const mainLayoutRoutes = [accountRoute, tournamentRoute, dashboardRoute];

// Routes using the Auth layout
export const authLayoutRoutes = [authRoutes];
