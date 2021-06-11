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

export const Errors = {
  "Error.Auth.WrongPassword": "Wrong Password!",
  "Error.UserNotFound": "User Not Found!",
  "Error.Auth.InvalidToken": "Invalid Token!",
};

export const Warnings = {
  "Warning.OldToken":
    "You have old token, please refresh the page to get new token",
  "Warning.UscfIdNotFound": "You've entered wrong USCF ID!",
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
  Exited: "Exited",
};
