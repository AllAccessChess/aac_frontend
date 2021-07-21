import { createSlice } from "@reduxjs/toolkit";

import { TournamentService } from "services";
import { validatePairing } from "utils/common";
import { setMessage } from "./messageReducer";

// import dummyTournaments from "data/tournaments";

const initialState = {
  list: [],
  pairings: null,
  current: null,
  loading: false,
  byeSaving: false,
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
      state.list.push({ ...action.payload });
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
    setByeSaving: (state, action) => {
      state.byeSaving = action.payload;
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
  setByeSaving,
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
    dispatch(updateListItem(tournament));
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
    dispatch(updateListItem(tournament));
    dispatch(setCurrent(tournament));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const startRound = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { tournament } = await TournamentService.startRound(id);
    dispatch(setCurrent(tournament));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const getPairings = (tournamentId, roundId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const {
      pairings,
      players,
      unpaired,
      byes,
    } = await TournamentService.getPairings(tournamentId, roundId);

    dispatch(
      setPairings(validatePairing({ pairings, players, unpaired, byes }))
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updatePairings = (tournamentId, roundId, newPairings) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    const {
      pairings,
      players,
      unpaired,
      byes,
    } = await TournamentService.updatePairings(
      tournamentId,
      roundId,
      newPairings
    );
    dispatch(setPairings({ pairings, players, unpaired, byes }));
    dispatch(
      setMessage({
        message: "Updated pairings for the round!",
        type: "success",
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateByes = (tournamentId, byes) => async (dispatch) => {
  dispatch(setByeSaving(true));
  try {
    await TournamentService.updateByes(tournamentId, byes);
    const { tournament } = await TournamentService.getTournament(tournamentId);
    dispatch(setCurrent(tournament));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setByeSaving(false));
};

export const createTournament = (payload, callback, fallback) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    const { tournament } = await TournamentService.createTournament(payload);
    dispatch(insertToList(tournament));
    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
    if (fallback) fallback();
  }
  dispatch(setLoading(false));
};

export const updateTournament = (payload, callback, fallback) => async (
  dispatch
) => {
  dispatch(setLoading(true));
  try {
    const { tournament } = await TournamentService.updateTournament(payload);
    dispatch(updateListItem(tournament));
    if (callback) callback(tournament);
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
    if (fallback) fallback();
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
