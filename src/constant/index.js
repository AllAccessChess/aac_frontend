// General
export const VALID_USCF_LENGTH = 8;
export const AUTH_TOKEN_STORAGE_KEY = "auth-token";

// Theme
export const THEME_SET = "THEME_SET";
export const THEMES = {
  DEFAULT: "DEFAULT",
  DARK: "DARK",
  LIGHT: "LIGHT",
  BLUE: "BLUE",
  GREEN: "GREEN",
  INDIGO: "INDIGO",
};

// Auth
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

// Game

export const GameActions = {
  PING: "ping",
  AUTH: "auth",
  SEEK: "seek",
  STATUS: "status",
  PLAY_AI: "playAi",
  MOVE: "move",
  RESIGN: "resign",
};

export const GameEvents = {
  GET_RESPONSE: "GET_RESPONSE",
  OPENED: "OPENED",
  AUTHENTICATED: "AUTHENTICATED",
};

export const GameStatus = {
  PREPARING: "Preparing",
  SEEKING: "Seeking",
  READY: "Ready",
  STARTED: "Started",
  EXITED: "Exited",
};
