import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";

import dummyTournaments from "data/tournaments";

const initialState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "tournamentReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      state.list = [...action.payload];
    },
    insertToList: (state, action) => {
      state.list.push([...action.payload]);
    },
    updateListItem: (state, action) => {
      let schemeList = [...state.list];
      let foundIndex = schemeList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        schemeList[foundIndex] = action.payload;
        state.list = schemeList;
      }
    },
    setCurrent: (state, action) => {
      state.current = { ...state.current, ...action.payload };
    },
    clearCurrent: (state, action) => {
      state.current = null;
    },
  },
});

export const {
  setLoading,
  setList,
  updateListItem,
  setCurrent,
  clearCurrent,
  insertToList,
} = slice.actions;

export const getTournamentList = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const tournaments = dummyTournaments;
    dispatch(setList(tournaments));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const getTournament = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const tournament = dummyTournaments[id];
    dispatch(setCurrent(tournament));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
