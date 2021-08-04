import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import UserService from "services/userService";

const initialState = {
  list: [],
  loading: false,
};

export const slice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      state.list = [...action.payload];
    },
    updateItem: (state, action) => {
      state.list = state.list.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
  },
});

const { setLoading, updateItem } = slice.actions;
export const { setList } = slice.actions;

export default slice.reducer;

export const getUserList = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { users } = await UserService.getAllUsers();
    dispatch(setList(users));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const updateUser = (user) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await UserService.updateUser(user);
    if (response.status !== "ok") {
      throw new Error(response.error);
    }
    dispatch(updateItem(response.user));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};
