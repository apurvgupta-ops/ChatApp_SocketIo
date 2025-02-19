import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: true,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExist: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    userNotExist: (state, action) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export default authSlice;
export const { userExist, userNotExist } = authSlice.actions;
