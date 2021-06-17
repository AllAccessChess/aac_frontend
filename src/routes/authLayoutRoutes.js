import loadable from "@loadable/component";

const SignIn = loadable(() => import("pages/auth/sign-in"));
const SignUp = loadable(() => import("pages/auth/sign-up"));
const ResetPassword = loadable(() => import("pages/auth/reset-password"));
const AuthCallback = loadable(() => import("pages/auth/callback"));

export const authLayoutRoutes = [
  {
    id: "auth",
    path: "/auth",
    children: [
      {
        id: "auth-sign-in",
        path: "/auth/sign-in",
        name: "Sign In",
        component: SignIn,
      },
      {
        id: "auth-sign-up",
        path: "/auth/sign-up",
        name: "Sign Up",
        component: SignUp,
      },
      {
        id: "auth-reset-password",
        path: "/auth/reset-password",
        name: "Reset Password",
        component: ResetPassword,
      },
      {
        id: "auth-callback",
        path: "/auth/callback",
        name: "Auth Callback",
        component: AuthCallback,
      },
    ],
  },
];
