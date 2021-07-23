import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import NotificationService from "services/notificationService";

const initialState = {
  list: [],
  loading: false,
};

export const slice = createSlice({
  name: "notificationReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      state.list = [...action.payload];
    },
  },
});

const { setLoading } = slice.actions;
export const { setList } = slice.actions;

export default slice.reducer;

export const getMyNotifications = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { notifications } = await NotificationService.getNotificationForMe();
    dispatch(setList(notifications));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};
