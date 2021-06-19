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
  DRAWOFFER: "drawOffer",
  DRAWRESPONSE: "drawResponse",
  RESIGN: "resign",
};

export const GameEvents = {
  GET_RESPONSE: "GET_RESPONSE",
  OPENED: "OPENED",
  AUTHENTICATED: "AUTHENTICATED",
  OFFEREDDRAW: "OFFEREDDRAW",
  EXITGAME: "EXITGAME",
};

export const GameStatus = {
  IDLE: "idle",
  SEEKING: "seeking",
  PLAYING: "playing",
  EXITED: "Exited",
};

export const GameEndReason = {
  CHECKMATE: 0,
  TIMEOUT: 1,
  RESIGNATION: 2,
  STALEMATE: 3,
  THREEFOLD: 4,
  INSUFFICIENT: 5,
  FIFTY_MOVE: 6,
  AGREEMENT: 7,
};

export const GameResults = {
  ONGOING: "*",
  DRAW: "1/2-1/2",
  WHITE_WIN: "1-0",
  BLACK_WIN: "0-1",
};

// Tournament

export const TournamentStatus = Object.freeze({
  ONGOING: 3,
  SCHEDULED: 0,
  FINISHED: 4,
});
