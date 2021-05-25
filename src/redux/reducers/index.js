import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";

import authReducer from "./authReducer";
import messageReducer from "./messageReducer";
import themeReducer from "./themeReducer";

const reducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    authReducer,
    messageReducer,
    themeReducer,
  });

export default reducers;
