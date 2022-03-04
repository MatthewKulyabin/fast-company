import { createSlice } from '@reduxjs/toolkit';

import commentService from '../services/comment.service';

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    entities: [],
    isLoading: true,
    error: null,
  },
  reducers: {
    commentsRequested: (state) => {
      state.isLoading = true;
    },
    commentsReceived: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    commentsRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    commentCreated: (state, action) => {
      state.entities.push(action.payload);
    },
    commentDeleted: (state, action) => {
      state.entities = state.entities.filter(
        (com) => com._id !== action.payload
      );
    },
  },
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
  commentsRequested,
  commentsReceived,
  commentsRequestFailed,
  commentCreated,
  commentDeleted,
} = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
  dispatch(commentsRequested());
  try {
    const { content } = await commentService.get(userId);
    dispatch(commentsReceived(content));
  } catch (error) {
    dispatch(commentsRequestFailed(error));
  }
};

export const createComment = (data) => async (dispatch) => {
  try {
    const { content } = await commentService.put(data);
    dispatch(commentCreated(content));
  } catch (error) {
    console.error(error);
  }
};

export const deleteComment = (id) => async (dispatch) => {
  try {
    await commentService.delete(id);
    dispatch(commentDeleted(id));
  } catch (error) {
    console.error(error);
  }
};

export const getCommentsList = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
  state.comments.isLoading;
export const getCommentById = (id) => (state) =>
  state.comments.entities.find((prof) => prof._id === id);

export default commentsReducer;
