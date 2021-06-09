// General
export const Valid_USCF_Length = 8;

// Theme Constatnts
export const THEME_SET = "THEME_SET";
export const THEMES = {
  DEFAULT: "DEFAULT",
  DARK: "DARK",
  LIGHT: "LIGHT",
  BLUE: "BLUE",
  GREEN: "GREEN",
  INDIGO: "INDIGO",
};

// Auth Constants

export const RENEW_DIFF = 1000 * 3600 * 24 * 2;

export const TokenVerificationResult = {
  Ok: "TokenVerificationResult.Ok",
  Invalid: "TokenVerificationResult.Invalid",
  Expired: "TokenVerificationResult.Expired",
};

export const AuthError = {
  InvalidPassword: "AuthError.InvalidPassword",
  InvalidUser: "AuthError.InvalidUser",
};

// Game Constants

export const GameActions = {
  join: "join",
  status: "status",
  rm: "rm",
  move: "move",
  resign: "resign",
};

export const GameEvents = {
  GET_RESPONSE: "GET_RESPONSE",
  Initialized: "Initialized",
};

export const GameStatus = {
  Preparing: "Preparing",
  Ready: "Ready",
  Started: "Started",
};
