import { createSlice } from '@reduxjs/toolkit';

export type UIState = {
  showLoader: boolean;
};

const initialState: UIState = {
  showLoader: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addLoader: (state: UIState) => {
      state.showLoader = true;
      return state;
    },
    removeLoader: (state: UIState) => {
      state.showLoader = false;
      return state;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
