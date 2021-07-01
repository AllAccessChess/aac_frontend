import { createSlice } from "@reduxjs/toolkit";

import { TournamentService } from "services";
import { setMessage } from "./messageReducer";

// import dummyTournaments from "data/tournaments";

const initialState = {
  list: [],
  pairings: null,
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
    setPairings: (state, action) => {
      state.pairings = action.payload;
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
  setPairings,
} = slice.actions;

export const getTournamentList = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // const tournaments = dummyTournaments;
    const { tournaments } = await TournamentService.getAllTournaments();
    dispatch(setList(tournaments));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const getTournament = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // const tournament = dummyTournaments[id];
    const { tournament } = await TournamentService.getTournament(id);
    dispatch(setCurrent(tournament));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const registerTournament = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { tournament } = await TournamentService.registerTournament(id);
    dispatch(setCurrent(tournament));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const unRegisterTournament = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { tournament } = await TournamentService.unregisterTournament(id);
    dispatch(setCurrent(tournament));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const getPairings = (tournamentId, roundId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { pairings, players, unpaired } = await TournamentService.getPairings(
      tournamentId,
      roundId
    );
    dispatch(setPairings({ pairings, players, unpaired }));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export const updatePairings = (tournamentId, roundId, parings) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    const {
      pairings,
      players,
      unpaired,
    } = await TournamentService.updatePairings(tournamentId, roundId, parings);
    dispatch(setPairings({ pairings, players, unpaired }));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
};

export default slice.reducer;
