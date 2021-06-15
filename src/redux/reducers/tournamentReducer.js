import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";

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

const dummyTournaments = [
  {
    id: 0,
    name: "US Chess Camp",
    rounds: [
      {
        id: 0,
        matches: [
          {
            id: "dfwer324",
            white: "William",
            black: "Rishabh",
          },
          {
            id: "34edsd",
            white: "Railson",
            black: "Alex",
          },
          {
            id: "4dcfsdf",
            white: "Alex",
            black: "William",
          },
          {
            id: "sdfxcv",
            white: "Rishabh",
            black: "Railson",
          },
        ],
      },
      {
        id: 1,
        white: "William",
        black: "Rishabh",
        matches: [
          {
            id: "234wefsxc",
            white: "William",
            black: "Rishabh",
          },
          {
            id: "sdfwe34",
            white: "Railson",
            black: "Alex",
          },
          {
            id: "34wedf",
            white: "Alex",
            black: "William",
          },
          {
            id: "sdf23d",
            white: "Rishabh",
            black: "Railson",
          },
        ],
      },
    ],
    organizedBy: "USCF",
    type: "Classical",
    duration: 30,
    extraDuration: 0,
    prize: 140,
    startAt: "2021-06-15T16:00:00.877Z",
    endAt: "2021-06-15T18:00:00.877Z",
  },
  {
    id: 1,
    name: "US Chess Camp 2",
    rounds: [
      {
        id: 0,
        matches: [
          {
            id: "dfwer324",
            white: "William",
            black: "Rishabh",
          },
          {
            id: "34edsd",
            white: "Railson",
            black: "Alex",
          },
          {
            id: "4dcfsdf",
            white: "Alex",
            black: "William",
          },
          {
            id: "sdfxcv",
            white: "Rishabh",
            black: "Railson",
          },
        ],
      },
      {
        id: 1,
        white: "William",
        black: "Rishabh",
        matches: [
          {
            id: "234wefsxc",
            white: "William",
            black: "Rishabh",
          },
          {
            id: "sdfwe34",
            white: "Railson",
            black: "Alex",
          },
          {
            id: "34wedf",
            white: "Alex",
            black: "William",
          },
          {
            id: "sdf23d",
            white: "Rishabh",
            black: "Railson",
          },
        ],
      },
    ],
    organizedBy: "USCF",
    type: "Classical",
    duration: 30,
    extraDuration: 0,
    prize: 140,
    startAt: "2021-06-15T16:00:00.877Z",
    endAt: "2021-06-15T18:00:00.877Z",
  },
];

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
