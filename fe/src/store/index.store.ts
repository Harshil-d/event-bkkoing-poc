import { configureStore } from '@reduxjs/toolkit';

import uiSlice, { UIState } from './slices/ui.slice';
import userSlice, { UserState } from './slices/user.slice';

export type GlobalState = {
  ui: UIState;
  user: UserState;
};

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    user: userSlice.reducer,
  },
});

export default store;
