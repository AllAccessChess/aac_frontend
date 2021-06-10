import { createSlice } from "@reduxjs/toolkit";
import { Errors, Warnings } from "constant";

const initialState = {
  msg: null,
  type: "error", //'success', 'warning'
  timeout: -1,
};

export const slice = createSlice({
  name: "messageReducer",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.msg = action.payload.message;
      state.type = action.payload.type || "error";
      state.timeout = action.payload.timeout || 3000;
    },
  },
});

export const { setMessage } = slice.actions;

export const showSuccess = (msg) => (dispatch) => {
  dispatch(setMessage({ message: msg, type: "success" }));
};

export const showError = (error) => (dispatch) => {
  let msg = Errors[error] || error;
  dispatch(setMessage({ message: msg }));
};

export const showWarning = (warning) => (dispatch) => {
  let msg = Warnings[warning] || warning;
  dispatch(setMessage({ message: msg, type: "warning" }));
};

export default slice.reducer;
