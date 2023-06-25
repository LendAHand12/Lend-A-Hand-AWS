import { createSlice } from "@reduxjs/toolkit";

var authLocalStorage = localStorage.getItem("auth");
var defaultInitialState = {};
if (authLocalStorage) {
  defaultInitialState = JSON.parse(authLocalStorage);
}

const auth = createSlice({
  name: "auth",
  initialState: defaultInitialState,
  reducers: {
    LOGIN: (state, action) => {
      Object.assign(state, action.payload);
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    REFRESH_TOKEN: (state, action) => {
      let newAuth = JSON.parse(localStorage.getItem("auth"));
      newAuth.accessToken = action.payload;
      localStorage.setItem("auth", JSON.stringify(newAuth));
      Object.assign(state, { ...state, accessToken: action.payload });
    },
    UPDATE_USER_INFO: (state, action) => {
      let newAuth = JSON.parse(localStorage.getItem("auth"));
      newAuth.userInfo = action.payload;
      localStorage.setItem("auth", JSON.stringify(newAuth));
      Object.assign(state, { ...state, userInfo: action.payload });
    },
    LOGOUT: (state) => {
      localStorage.removeItem("auth");
      Object.assign(state, {});
      return {};
    },
  },
});

const { reducer, actions } = auth;
export const { LOGIN, LOGOUT, UPDATE_USER_INFO, REFRESH_TOKEN } = actions;
export default reducer;
