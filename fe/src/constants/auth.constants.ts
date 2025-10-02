export interface IAuthState {
  signedIn: number;
  signedOut: number;
  authenticated: number;
}

const authState: IAuthState = {
  signedIn: 1,
  signedOut: 2,
  authenticated: 3,
};

export interface IAuthTokenKeys {
  accessTokenKey: string;
  accessTokenExpiryTimeKey: string;
  refreshTokenKey: string;
  refreshTokenExpiryTimeKey: string;
  signInRoleKey: string;
}

export const authTokenKeys: IAuthTokenKeys = {
  accessTokenKey:
    '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
  accessTokenExpiryTimeKey:
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
  refreshTokenKey:
    'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
  refreshTokenExpiryTimeKey:
    '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
  signInRoleKey:
    '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
};

export interface IAuthConstants {
  authState: IAuthState;
  authTokenKeys: IAuthTokenKeys;
}

export const authConstants: IAuthConstants = {
  authState,
  authTokenKeys,
};
