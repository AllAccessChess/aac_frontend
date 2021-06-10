import { createSlice } from "@reduxjs/toolkit";
import AuthService from "services/authService";
import UserService from "services/userService";
import StorageService from "services/storageService";
import { setMessage } from "./messageReducer";
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
      dispatch(setMessage({ message: response.error }));
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
    dispatch(setMessage({ message: error.message }));
  }
  dispatch(setLoading(false));
};

export const signUp = (payload) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await AuthService.register(payload);
    if (response.status !== "ok") {
      dispatch(setMessage({ message: response.error }));
    } else {
      StorageService.setAuthToken({
        token: response.token,
        expiry: response.expiry,
      });
      StorageService.setUserID(response.user.id);
      dispatch(setUser(response.user));
      setMessage({ message: "Successfully registered!", type: "success" });
    }
  } catch (error) {
    console.log(error);
    dispatch(setMessage({ message: error.message }));
  }

  dispatch(setLoading(false));
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
          const user = await UserService.getUser(userID);
          dispatch(setUser(user));
        }
      } else {
        const user = await UserService.getUser(userID);
        dispatch(setUser(user));
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
