import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import { GameService } from "services";

const initialState = {
  loading: false,
  current: null,
  liveGames: [],
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
    setLiveGames: (state, action) => {
      state.liveGames = [...action.payload];
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
  setLiveGames,
  addHistoryItem,
  popHistoryItem,
} = slice.actions;

export const getLiveGames = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { games } = await GameService.getLiveGames();
    dispatch(setLiveGames(games));
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

export const downloadPGN = (id, roundTitle) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const pgnData = await GameService.getPGNData(id);
    const blob = new Blob([pgnData], {
      type: "application/octet-stream",
    });
    const blobURL = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = blobURL;
    a.download = `${roundTitle}.pgn`;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(blobURL);
    }, 100);
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
