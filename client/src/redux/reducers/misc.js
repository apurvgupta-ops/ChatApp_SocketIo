import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isNotification: false,
  isSearch: false,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
  },
});

export default miscSlice;
export const { setIsMobile, setIsNotification, setIsSearch } =
  miscSlice.actions;
