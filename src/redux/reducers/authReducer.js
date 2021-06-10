import { createSlice } from "@reduxjs/toolkit";
import AuthService from "services/authService";
import UserService from "services/userService";
import StorageService from "services/storageService";
import { showSuccess, showError, showWarning } from "./messageReducer";
import { RENEW_DIFF } from "constant";

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
    if (response.status !== "ok") {
      dispatch(showError(response.error));
    } else {
      StorageService.setAuthToken({
        token: response.token,
        expiry: response.expiry,
      });
      StorageService.setUserID(response.user.id);
      dispatch(setUser(response.user));
    }
  } catch (error) {
    console.log(error);
    dispatch(showError(error.message));
  }
  dispatch(setLoading(false));
};

export const signUp = (payload) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await AuthService.register(payload);
    if (response.status !== "ok") {
      dispatch(showError(response.error));
    } else {
      StorageService.setAuthToken({
        token: response.token,
        expiry: response.expiry,
      });
      StorageService.setUserID(response.user.id);
      dispatch(setUser(response.user));
      if (response.warnings) {
        for (let warn of response.warnings) dispatch(showWarning(warn));
      } else {
        dispatch(showSuccess("Successfully registered!"));
      }
    }
  } catch (error) {
    console.log(error);
    dispatch(showError(error.message));
  }

  dispatch(setLoading(false));
};

export const getUser = (userID) => async (dispatch) => {
  try {
    const response = await UserService.getUser(userID);
    if (response.status !== "ok") {
      dispatch(showError(response.error));
    } else {
      dispatch(setUser(response.user));
    }
  } catch (error) {
    console.log(error);
    dispatch(showError(error.message));
  }
};

export const signInWithToken = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const tokenData = StorageService.getAuthToken();
    const userID = StorageService.getUserID();
    const currentTime = new Date().getTime();
    if (tokenData && tokenData.expiry > currentTime && userID) {
      if (RENEW_DIFF > tokenData.expiry - currentTime) {
        const response = await AuthService.renew();
        if (response.status === "ok") {
          StorageService.setAuthToken({
            token: response.token,
            expiry: response.expiry,
          });
          dispatch(getUser(userID));
        }
      } else {
        dispatch(getUser(userID));
      }
    }
  } catch (error) {
    console.log(error);
  }
  dispatch(setLoading(false));
};

export const logOut = () => (dispatch) => {
  StorageService.clearTokens();
  dispatch(setUser(null));
};

export default slice.reducer;
