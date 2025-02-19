import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isNotification: false,
  isSearch: false,
  isNewGroup: false,
  isAddMember: false,
  isMobileMenuFriend: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    groupChart: false,
  }
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
    setIsNewGroup: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsAddMember: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsMobileMenuFriend: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isSearch = action.payload;
    },
  },
});

export default miscSlice;
export const { setIsMobile, setIsNotification, setIsSearch, setIsNewGroup, setIsAddMember, setIsMobileMenuFriend, setIsFileMenu, setIsDeleteMenu } =
  miscSlice.actions;
