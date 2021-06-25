import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import { GameService } from "services";

const initialState = {
  loading: false,
  current: null,
  liveIDs: [],
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
    setLiveIDs: (state, action) => {
      state.liveIDs = [...action.payload];
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
  setLiveIDs,
  addHistoryItem,
  popHistoryItem,
} = slice.actions;

export const getLiveGameIDs = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { games } = await GameService.getLiveGames();
    dispatch(setLiveIDs(games));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const getMatch = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { game } = await GameService.getGame(id);
    dispatch(setCurrent(game));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
