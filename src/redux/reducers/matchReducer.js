import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";

import dummyTournaments from "data/tournaments";

const initialState = {
  loading: false,
  current: null,
  history: [],
};

export const slice = createSlice({
  name: "matchReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCurrent: (state, action) => {
      state.current = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    addHistoryItem: (state, action) => {
      state.history.push(action.payload);
    },
    popHistoryItem: (state, action) => {
      let length = action.payload;
      state.history = state.history.slice(0, state.history.length - length);
    },
  },
});

export const {
  setLoading,
  setCurrent,
  setHistory,
  addHistoryItem,
  popHistoryItem,
} = slice.actions;

export const getMatch = (id) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const match = dummyTournaments
      .reduce(
        (matches, t) => [
          ...matches,
          ...t.rounds.reduce(
            (matches, r) => [
              ...matches,
              ...r.matches.map((m) => ({
                ...m,
                round: r.id,
                tournament: t.name,
              })),
            ],
            []
          ),
        ],
        []
      )
      .find((m) => m.id === id);
    dispatch(setCurrent(match));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
