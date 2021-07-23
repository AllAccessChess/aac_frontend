import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";

import authReducer from "./authReducer";
import messageReducer from "./messageReducer";
import themeReducer from "./themeReducer";
import matchReducer from "./matchReducer";
import tournamentReducer from "./tournamentReducer";
import userReducer from "./userReducer";

const reducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    authReducer,
    messageReducer,
    themeReducer,
    matchReducer,
    tournamentReducer,
    userReducer,
  });

export const authSelector = (state) => state.authReducer;
export const themeSelector = (state) => state.themeReducer;
export const messageSelector = (state) => state.messageReducer;
export const matchSelector = (state) => state.matchReducer;
export const tournamentSelector = (state) => state.tournamentReducer;

export default reducers;
