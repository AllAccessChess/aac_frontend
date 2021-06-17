import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";

import authReducer from "./authReducer";
import messageReducer from "./messageReducer";
import themeReducer from "./themeReducer";
import matchReducer from "./matchReducer";
import tournamentReducer from "./tournamentReducer";

const reducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    authReducer,
    messageReducer,
    themeReducer,
    matchReducer,
    tournamentReducer,
  });

export const authSelector = (state) => state.authReducer;
export const themeSelector = (state) => state.themeReducer;

export default reducers;
