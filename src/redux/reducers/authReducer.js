import { createSlice } from "@reduxjs/toolkit";
// import AuthService from "services/authService";
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
    // const response = await AuthService.login(credentials);
    const response = {
      user: {
        id: "12345",
        email: credentials.email,
        name: "Railson Sousa",
      },
    };
    dispatch(setUser(response.user));
  } catch (error) {
    console.log(error);
    dispatch(setMessage({ message: error.message }));
  }
  dispatch(setLoading(false));
};

export const signUp = (payload, callback) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    // await AuthService.register(payload);
    dispatch(
      setMessage({ message: "Successfully registered!", type: "success" })
    );
    if (callback) callback();
  } catch (error) {
    console.log(error);
    dispatch(setMessage({ message: error.message }));
  }

  dispatch(setLoading(false));
};

export default slice.reducer;
