import { createSlice } from "@reduxjs/toolkit";
import { THEMES } from "constant";

const initialState = {
  currentTheme: THEMES.BLUE,
  sidebarCollapsed: false,
};

export const slice = createSlice({
  name: "themeReducer",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { setTheme, setSidebarCollapsed } = slice.actions;

export default slice.reducer;
