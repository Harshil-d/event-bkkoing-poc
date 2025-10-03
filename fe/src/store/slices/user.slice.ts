import { createSlice } from '@reduxjs/toolkit';

import { IUser } from '../../interfaces/user.interface';

export type UserState = {
  user: IUser | null;
};

const initialState: UserState = {
  user: null,
};

export interface ISetSignInUserAction {
  payload: {
    firstName: string;
    lastName?: string;
    role: string;
    organizationName?: string;
  };
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSignInUser: (state: UserState, { payload }: ISetSignInUserAction) => {
      state.user = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        organizationName: payload.organizationName,
      };
      return state;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
