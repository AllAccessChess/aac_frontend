import { createSlice } from "@reduxjs/toolkit";
import { THEMES } from "constant";

const initialState = {
  currentTheme: THEMES.BLUE,
};

export const slice = createSlice({
  name: "themeReducer",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = slice.actions;

export default slice.reducer;
