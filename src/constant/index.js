// General
export const VALID_USCF_LENGTH = 8;
export const AUTH_TOKEN_STORAGE_KEY = "auth-token";

// Theme
export const THEME_SET = "THEME_SET";
export const THEMES = Object.freeze({
  DEFAULT: "DEFAULT",
  DARK: "DARK",
  LIGHT: "LIGHT",
  BLUE: "BLUE",
  GREEN: "GREEN",
  INDIGO: "INDIGO",
});

// Auth
export const RENEW_DIFF = 1000 * 3600 * 24 * 2;

export const Errors = Object.freeze({
  Auth_WrongPassword: "Error.Auth.WrongPassword",
  UserNotFound: "Error.UserNotFound",
  Auth_InvalidToken: "Error.Auth.InvalidToken",
});

export const ErrorMessages = Object.freeze({
  [Errors.Auth_WrongPassword]: "Wrong Password!",
  [Errors.UserNotFound]: "User Not Found!",
  [Errors.Auth_InvalidToken]: "Invalid Token!",
});

export const Warnings = Object.freeze({
  OldToken: "Warning.OldToken",
  UscfIdNotFound: "Warning.UscfIdNotFound",
});

export const WarningMessages = Object.freeze({
  [Warnings.OldToken]:
    "You have old token, please refresh the page to get new token",
  [Warnings.UscfIdNotFound]: "You've entered wrong USCF ID!",
});

// Game

export const GameActions = Object.freeze({
  PING: "ping",
  AUTH: "auth",
  SEEK: "seek",
  JOIN: "join",
  SPECTATE: "spectate",
  STATUS: "status",
  PLAY_AI: "playAi",
  MOVE: "move",
  DRAWOFFER: "drawOffer",
  DRAWRESPONSE: "drawResponse",
  RESIGN: "resign",
  STOPSPECTATE: "stopSpectating",
});

export const GameEvents = Object.freeze({
  GET_RESPONSE: "GET_RESPONSE",
  OPENED: "OPENED",
  AUTHENTICATED: "AUTHENTICATED",
  OFFEREDDRAW: "OFFEREDDRAW",
  EXITGAME: "EXITGAME",
});

export const GameStatus = Object.freeze({
  IDLE: "idle",
  SEEKING: "seeking",
  JOINING: "joining",
  PLAYING: "playing",
  EXITED: "Exited",
});

export const GameEndReason = Object.freeze({
  CHECKMATE: 0,
  TIMEOUT: 1,
  RESIGNATION: 2,
  STALEMATE: 3,
  THREEFOLD: 4,
  INSUFFICIENT: 5,
  FIFTY_MOVE: 6,
  AGREEMENT: 7,
});

export const GameEndReasonMessage = Object.freeze({
  [GameEndReason.CHECKMATE]: "checkmate",
  [GameEndReason.TIMEOUT]: "timeout",
  [GameEndReason.RESIGNATION]: "resignation",
  [GameEndReason.STALEMATE]: "stalemate",
  [GameEndReason.THREEFOLD]: "threefold",
  [GameEndReason.INSUFFICIENT]: "insufficient",
  [GameEndReason.FIFTY_MOVE]: "fifty move",
  [GameEndReason.AGREEMENT]: "agreement",
});

export const GameResults = Object.freeze({
  ONGOING: "*",
  DRAW: "1/2-1/2",
  WHITE_WIN: "1-0",
  BLACK_WIN: "0-1",
});

// Tournament

export const TournamentStatus = Object.freeze({
  ONGOING: 3,
  SCHEDULED: 1,
  FINISHED: 4,
});

export const RoundStatus = Object.freeze({
  SETUP: 0, // Admin Setup
  PREP: 1, // Player preparation time - count down
  PLAYING: 2,
  FINISHED: 3,
});

// Chat

export const ChatEvents = Object.freeze({
  OPEN: "open",
  MESSAGE: "message",
  STATUS: "status",
  ERROR: "error",
  JOINED: "joined",
  LEFT: "left",
  RECONNECTED: "reconnected",
  DISCONNECTED: "disconnected",
});

export const ChatActions = Object.freeze({
  PING: "ping",
  PONG: "pong",
  JOIN: "join",
  STATUS: "status",
  MESSAGE: "message",
});
