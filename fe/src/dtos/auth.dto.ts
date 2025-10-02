import { GenericResponse } from './generic.dto';

export interface ISignInResponse
  extends GenericResponse<{
    refreshToken: string;
    accessToken: string;
  }> {}

export interface IAccessTokenResponse
  extends GenericResponse<{
    accessToken: string;
  }> {}

export interface IForgotPasswordRequestResponse extends GenericResponse<null> {}

export interface IResetPasswordResponse extends GenericResponse<null> {}
