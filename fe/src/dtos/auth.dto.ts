import { GenericResponse } from './generic.dto';

export interface IAuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: IAuthenticatedUser;
  tokens: IAuthTokens;
}

export interface ISignInResponse extends GenericResponse<IAuthResponse> {}

export interface ISignUpResponse extends GenericResponse<IAuthResponse> {}

export interface IAccessTokenResponse
  extends GenericResponse<{
    accessToken: string;
  }> {}

export interface IForgotPasswordRequestResponse extends GenericResponse<null> {}

export interface IResetPasswordResponse extends GenericResponse<null> {}

export interface IUserRegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface IUserLoginRequest {
  email: string;
  password: string;
}
