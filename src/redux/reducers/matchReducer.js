import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";

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

const dummyMatch = {
  id: 0,
  white: "William",
  black: "Rishabh",
};

export const getMatch = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const match = dummyMatch;
    dispatch(setCurrent(match));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
