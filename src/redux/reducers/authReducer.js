import { createSlice } from "@reduxjs/toolkit";
import AuthService from "services/authService";
import UserService from "services/userService";
import { setAuthToken, getAuthToken, clearTokens } from "utils/storage";
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

    setAuthToken({
      token: response.token,
      expiry: response.expiry,
    });

    const { user } = await UserService.getMe();
    dispatch(setUser(user));
  } catch (error) {
    console.log(error);
    dispatch(showError(error.message));
  }
  dispatch(setLoading(false));
};

export const signUp = (payload, callback, fallback) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await AuthService.register(payload);
    setAuthToken({
      token: response.token,
      expiry: response.expiry,
    });
    dispatch(setUser(response.user));
    if (response.warnings) {
      for (let warn of response.warnings) dispatch(showWarning(warn));
    } else {
      dispatch(showSuccess("Successfully registered!"));
    }
    if (callback) callback();
  } catch (error) {
    console.log(error);
    dispatch(showError(error.message));
    if (fallback) fallback();
  }
  dispatch(setLoading(false));
};

export const signInWithToken = (
  showMessage = false,
  callback,
  fallback
) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const tokenData = getAuthToken();
    const currentTime = new Date().getTime();
    if (tokenData && tokenData.expiry > currentTime) {
      if (RENEW_DIFF > tokenData.expiry - currentTime) {
        const response = await AuthService.renew();
        setAuthToken({
          token: response.token,
          expiry: response.expiry,
        });
      }
      const meResponse = await UserService.getMe();
      dispatch(setUser(meResponse.user));
      if (callback) callback(meResponse.user);
    } else {
      if (fallback) fallback("Auth Token is expired!");
    }
  } catch (error) {
    console.log(error);
    clearTokens();
    if (showMessage) dispatch(showError(error.message));
    if (fallback) fallback(error.message);
  }
  dispatch(setLoading(false));
};

export const updateMe = (payload) => async (dispatch) => {
  try {
    const { user } = await UserService.updateUser(payload);
    dispatch(setUser(user));
  } catch (error) {
    console.log(error);
    dispatch(showError(error.message));
  }
};

export const logOut = () => (dispatch) => {
  clearTokens();
  dispatch(setUser(null));
};

export default slice.reducer;
