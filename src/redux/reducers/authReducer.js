import { createSlice } from "@reduxjs/toolkit";
import AuthService from "services/authService";
import StorageService from "services/storageService";
import { setMessage } from "./messageReducer";

const initialState = {
  user: undefined,
  loading: false,
};

export const slice = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = slice.actions;

export const signIn = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await AuthService.login(credentials);
    StorageService.setAuthToken(response.token);
    StorageService.setUserID(response.user.id);
    dispatch(setUser(response.user));
  } catch (error) {
    console.log(error);
    dispatch(setMessage({ message: error.message }));
  }
  dispatch(setLoading(false));
};

export const signUp = (payload) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await AuthService.register(payload);
    StorageService.setAuthToken(response.token);
    StorageService.setUserID(response.user.id);
    dispatch(setUser(response.user));
    setMessage({ message: "Successfully registered!", type: "success" });
  } catch (error) {
    console.log(error);
    dispatch(setMessage({ message: error.message }));
  }

  dispatch(setLoading(false));
};

export default slice.reducer;
