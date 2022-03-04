import { createAction, createSlice } from '@reduxjs/toolkit';

import authService from '../services/auth.service';
import {
  getAccessToken,
  getUserId,
  removeAuthData,
  setTokens,
} from '../services/localStorage.service';
import userService from '../services/user.service';
import { generateAuthError } from '../utils/generateAuthError';
import history from '../utils/history';

const initialState = getAccessToken()
  ? {
      entities: [],
      isLoading: true,
      error: null,
      auth: getUserId(),
      isLoggedIn: true,
      dataLoaded: false,
    }
  : {
      entities: [],
      isLoading: false,
      error: null,
      auth: null,
      isLoggedIn: false,
      dataLoaded: false,
    };

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    usersRequested: (state) => {
      state.isLoading = true;
    },
    usersReceived: (state, action) => {
      state.entities = action.payload;
      state.dataLoaded = true;
      state.isLoading = false;
    },
    usersRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    authRequestSuccess: (state, action) => {
      state.auth = action.payload;
      state.isLoggedIn = true;
    },
    authRequestFailed: (state, action) => {
      state.error = action.payload;
    },
    userCreated: (state, action) => {
      state.entities.push(action.payload);
    },
    userLoggedOut: (state) => {
      state.entities = null;
      state.isLoggedIn = false;
      state.auth = null;
      state.dataLoaded = false;
    },
    userUpdated: (state, action) => {
      const updatedUser = action.payload;
      const index = state.entities.findIndex((u) => u._id === updatedUser._id);
      state.entities[index] = updatedUser;
    },
    authRequested: (state) => {
      state.error = null;
    },
  },
});

const { reducer: usersReducer, actions } = usersSlice;
const {
  usersRequested,
  usersReceived,
  usersRequestFailed,
  authRequestSuccess,
  authRequestFailed,
  userLoggedOut,
  userUpdated,
} = actions;

const authRequested = createAction('users/authRequested');
const userUpdateRequestFailed = createAction('users/userUpdateRequestFailed');

export const login = (payload) => async (dispatch) => {
  const { email, password } = payload.data;
  dispatch(authRequested());
  try {
    const data = await authService.login({ email, password });
    setTokens(data);
    dispatch(authRequestSuccess({ userId: data.userId }));
    history.push(payload.redirect);
  } catch (error) {
    const { code, message } = error.response.data.error;
    if (code === 400) {
      const errorMessage = generateAuthError(message);
      dispatch(authRequestFailed(errorMessage));
    } else {
      dispatch(authRequestFailed(error.message));
    }
  }
};

export const signUp = (payload) => async (dispatch) => {
  try {
    dispatch(authRequested());
    const data = await authService.register(payload);
    setTokens(data);
    history.push('/users');
    dispatch(authRequestSuccess({ userId: data.localId }));
  } catch (error) {
    dispatch(authRequestFailed(error.message));
  }
};

export const logOut = () => async (dispatch) => {
  removeAuthData();
  history.push('/');
  dispatch(userLoggedOut());
};

export const loadUsersList = () => async (dispatch) => {
  dispatch(usersRequested());
  try {
    const { content } = await userService.get();
    dispatch(usersReceived(content));
  } catch (error) {
    dispatch(usersRequestFailed(error));
  }
};

export const updateUser = (data) => async (dispatch) => {
  try {
    const { content } = await userService.update(data);
    dispatch(userUpdated(content));
    history.push(`/users/${getUserId()}`);
  } catch (error) {
    dispatch(userUpdateRequestFailed(error.message));
  }
};

export const getUsersList = () => (state) => state.users.entities;
export const getCurrentUserData = () => (state) =>
  state.users.entities?.find((u) => u._id === state.users.auth);
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;
export const getUserById = (id) => (state) =>
  state.users.entities.find((prof) => prof._id === id);
export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getCurrentUserId = () => (state) => state.users.auth;
export const getAuthError = () => (state) => state.users.error;

export default usersReducer;
