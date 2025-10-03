import { ActionFunctionArgs, json } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

import { constants } from '../constants/index.constants';
import {
  IAccessTokenResponse,
  IForgotPasswordRequestResponse,
  IResetPasswordResponse,
  ISignInResponse,
  ISignUpResponse,
} from '../dtos/auth.dto';
import { IFormError } from '../interfaces/forms.interface';
import {
  clearAuthSession,
  wrapErrorResponse,
  wrapResponse,
} from '../helpers/api.helper';
import { timeDifferenceInMilliSecondsFromCurrentTime } from '../helpers/dateTime.helper';
import axios from '../utilities/axios.utility';

export const checkLoginStatus = async (): Promise<number> => {
  const { refreshTokenKey, accessTokenKey } = constants.auth.authTokenKeys;
  const { signedIn, signedOut } = constants.auth.authState;

  const refreshToken = localStorage.getItem(refreshTokenKey);
  const accessToken = localStorage.getItem(accessTokenKey);

  if (accessToken) {
    return signedIn;
  }

  if (refreshToken) {
    await createAccessToken();
    return signedIn;
  }

  return signedOut;
};

const saveStoreLogin = (accessToken: string, userDetails?: any) => {
  const { accessTokenKey, accessTokenExpiryTimeKey, signInRoleKey } =
    constants.auth.authTokenKeys;

  localStorage.setItem(accessTokenKey, accessToken);

  const decodedAccessToken = jwtDecode(accessToken);
  const accessTokenExpiryTime = (decodedAccessToken as any)?.exp * 1000;
  const signInRole = (decodedAccessToken as any).role;

  localStorage.setItem(
    accessTokenExpiryTimeKey,
    accessTokenExpiryTime.toString()
  );
  localStorage.setItem(signInRoleKey, signInRole);
  
  // Store user details if provided
  if (userDetails) {
    const userDetailsForStorage = {
      firstName: userDetails.fullName?.split(' ')[0] || userDetails.email?.split('@')[0] || 'User',
      lastName: userDetails.fullName?.split(' ').slice(1).join(' ') || '',
      role: userDetails.role || signInRole,
      organizationName: 'Event Booking'
    };
    localStorage.setItem('userDetails', JSON.stringify(userDetailsForStorage));
  }

  setTimeout(() => {
    createAccessToken();
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(accessTokenExpiryTimeKey);
    localStorage.removeItem(signInRoleKey);
    localStorage.removeItem('userDetails');
  }, timeDifferenceInMilliSecondsFromCurrentTime(accessTokenExpiryTime) - 5 * 60 * 1000);
};

export const createAccessToken = async (): Promise<IAccessTokenResponse> => {
  try {
    const { refreshTokenKey, refreshTokenExpiryTimeKey } =
      constants.auth.authTokenKeys;

    const refreshToken = localStorage.getItem(refreshTokenKey);

    const response = await axios.post(
      `/auth/refresh-token`,
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );

    const result = wrapResponse<IAccessTokenResponse>(response);

    if (result.statusCode === constants.api.httpStatusCodes.unauthorized) {
      localStorage.removeItem(refreshTokenKey);
      localStorage.removeItem(refreshTokenExpiryTimeKey);
      window.location.href = '/sign-in';
      return result;
    }

    if (
      result.statusCode === constants.api.httpStatusCodes.ok &&
      result.payload
    ) {
      const { accessToken } = result.payload;
      saveStoreLogin(accessToken);
    }

    if (
      result.statusCode === constants.api.httpStatusCodes.ok &&
      !result.payload?.accessToken
    ) {
      clearAuthSession();
      window.location.href = '/sign-in';
    }

    return result;
  } catch (err: any) {
    return wrapErrorResponse<IAccessTokenResponse>(err);
  }
};

export const signIn = async ({
  request,
}: ActionFunctionArgs): Promise<ISignInResponse | Response> => {
  try {
    const data = await request.formData();

    const email = data.get('email') as string;
    const password = data.get('password') as string;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (email.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'email',
        showOnElement: true,
        error: 'Email should not be empty',
      });
    }

    if (password.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'password',
        showOnElement: true,
        error: 'Password should not be empty',
      });
    }

    if (formError.hasErrors) {
      return json({
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      }) as unknown as ISignInResponse;
    }
    
    const response = await axios.post(`/auth/user/login`, {
      email,
      password,
    });

    const result = wrapResponse<ISignInResponse>(response);

    if (
      result.statusCode === constants.api.httpStatusCodes.ok &&
      result.payload
    ) {
      const { refreshToken, accessToken } = result.payload.tokens;

      const {
        refreshTokenKey,
        refreshTokenExpiryTimeKey,
        accessTokenKey,
        accessTokenExpiryTimeKey,
        signInRoleKey,
      } = constants.auth.authTokenKeys;

      localStorage.setItem(refreshTokenKey, refreshToken);
      const decodedRefreshToken = jwtDecode(refreshToken);
      const refreshTokenExpiryTime = (decodedRefreshToken as any)?.exp * 1000;
      localStorage.setItem(
        refreshTokenExpiryTimeKey,
        refreshTokenExpiryTime.toString()
      );

      setTimeout(() => {
        localStorage.removeItem(refreshTokenKey);
        localStorage.removeItem(refreshTokenExpiryTimeKey);
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(accessTokenExpiryTimeKey);
        localStorage.removeItem(signInRoleKey);
        localStorage.removeItem('userDetails');
        window.location.href = '/sign-in';
      }, timeDifferenceInMilliSecondsFromCurrentTime(refreshTokenExpiryTime) - 5 * 60 * 1000);

      // Store access token and user details
      saveStoreLogin(accessToken, result.payload.user);
    }
    return result;
  } catch (err: any) {
    return wrapErrorResponse<ISignInResponse>(err);
  }
};

export const forgotPassword = async ({
  request,
}: ActionFunctionArgs): Promise<IForgotPasswordRequestResponse | Response> => {
  try {
    const data = await request.formData();

    const userName = data.get('username') as string;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (userName.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'username',
        showOnElement: true,
        error: 'Username should not be empty',
      });
    }

    if (formError.hasErrors) {
      return json({
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      }) as unknown as IForgotPasswordRequestResponse;
    }

    const response = await axios.post(`/auth/forgot-password`, {
      email: userName,
    });

    return wrapResponse<IForgotPasswordRequestResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IForgotPasswordRequestResponse>(err);
  }
};

export const resetPassword = async ({
  request,
  params,
}: ActionFunctionArgs): Promise<IResetPasswordResponse | Response> => {
  try {
    const { token } = params;
    const data = await request.formData();

    const password = data.get('password') as string;
    const confirmPassword = data.get('confirm-password') as string;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (password !== confirmPassword) {
      formError.hasErrors = true;
      formError.errors.push(
        'Passwords do not match. Please ensure both fields are identical.'
      );
    } else if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(
        password
      )
    ) {
      formError.hasErrors = true;
      formError.errors.push(
        'Password must be a minimum of 8 characters and a maximum of 20 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
    }

    if (formError.hasErrors) {
      return json({
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      }) as unknown as IResetPasswordResponse;
    }

    const response = await axios.post(`/auth/reset-password`, {
      token,
      password,
    });

    return wrapResponse<IResetPasswordResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IResetPasswordResponse>(err);
  }
};

// Wrapper for Root page loader that handles redirection
export const checkLoginStatusForRoot = async (): Promise<number> => {
  const status = await checkLoginStatus();
  if (status !== constants.auth.authState.signedIn) {
    // The Root page will handle the actual redirection
    return constants.auth.authState.signedOut;
  }
  return constants.auth.authState.signedIn;
};

// Admin sign in function
export const adminSignIn = async ({
  request,
}: ActionFunctionArgs): Promise<ISignInResponse | Response> => {
  try {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (email.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'email',
        showOnElement: true,
        error: 'Email should not be empty',
      });
    }

    if (password.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'password',
        showOnElement: true,
        error: 'Password should not be empty',
      });
    }

    if (formError.hasErrors) {
      return json({
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      }) as unknown as ISignInResponse;
    }

    const response = await axios.post(`/auth/admin/login`, {
      email,
      password,
    });

    const result = wrapResponse<ISignInResponse>(response);

    if (
      result.statusCode === constants.api.httpStatusCodes.ok &&
      result.payload
    ) {
      const { refreshToken, accessToken } = result.payload.tokens;

      const {
        refreshTokenKey,
        refreshTokenExpiryTimeKey,
        accessTokenKey,
        accessTokenExpiryTimeKey,
        signInRoleKey,
      } = constants.auth.authTokenKeys;

      localStorage.setItem(refreshTokenKey, refreshToken);
      const decodedRefreshToken = jwtDecode(refreshToken);
      const refreshTokenExpiryTime = (decodedRefreshToken as any)?.exp * 1000;
      localStorage.setItem(
        refreshTokenExpiryTimeKey,
        refreshTokenExpiryTime.toString()
      );

      setTimeout(() => {
        localStorage.removeItem(refreshTokenKey);
        localStorage.removeItem(refreshTokenExpiryTimeKey);
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(accessTokenExpiryTimeKey);
        localStorage.removeItem(signInRoleKey);
        window.location.href = '/sign-in';
      }, timeDifferenceInMilliSecondsFromCurrentTime(refreshTokenExpiryTime) - 5 * 60 * 1000);

      saveStoreLogin(accessToken, result.payload.user);

      const successResponse = {
        statusCode: constants.api.httpStatusCodes.ok,
        message: 'Admin login successful',
        payload: { user: result.payload.user, tokens: result.payload.tokens }
      } as ISignInResponse;

      return successResponse;
    }

    return {
      statusCode: constants.api.httpStatusCodes.unauthorized,
      message: 'Invalid admin credentials',
      payload: undefined
    } as ISignInResponse;
  } catch (err: any) {
    return {
      statusCode: constants.api.httpStatusCodes.internalServerError,
      message: 'Admin login failed',
      payload: undefined
    } as ISignInResponse;
  }
};

// User sign up function
export const signUp = async ({
  request,
}: ActionFunctionArgs): Promise<ISignUpResponse | Response> => {
  try {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const fullName = data.get('fullName') as string;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (email.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'email',
        showOnElement: true,
        error: 'Email should not be empty',
      });
    }

    if (password.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'password',
        showOnElement: true,
        error: 'Password should not be empty',
      });
    }

    if (fullName.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'fullName',
        showOnElement: true,
        error: 'Full name should not be empty',
      });
    }

    if (formError.hasErrors) {
      return json({
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      }) as unknown as ISignUpResponse;
    }

    const response = await axios.post(`/auth/user/register`, {
      email,
      password,
      fullName,
    });

    const result = wrapResponse<ISignUpResponse>(response);

    if (
      result.statusCode === constants.api.httpStatusCodes.created &&
      result.payload
    ) {
      const { refreshToken, accessToken } = result.payload.tokens;

      const {
        refreshTokenKey,
        refreshTokenExpiryTimeKey,
        accessTokenKey,
        accessTokenExpiryTimeKey,
        signInRoleKey,
      } = constants.auth.authTokenKeys;

      localStorage.setItem(refreshTokenKey, refreshToken);
      const decodedRefreshToken = jwtDecode(refreshToken);
      const refreshTokenExpiryTime = (decodedRefreshToken as any)?.exp * 1000;
      localStorage.setItem(
        refreshTokenExpiryTimeKey,
        refreshTokenExpiryTime.toString()
      );

      setTimeout(() => {
        localStorage.removeItem(refreshTokenKey);
        localStorage.removeItem(refreshTokenExpiryTimeKey);
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(accessTokenExpiryTimeKey);
        localStorage.removeItem(signInRoleKey);
        window.location.href = '/sign-in';
      }, timeDifferenceInMilliSecondsFromCurrentTime(refreshTokenExpiryTime) - 5 * 60 * 1000);

      saveStoreLogin(accessToken, result.payload.user);

      const successResponse = {
        statusCode: constants.api.httpStatusCodes.created,
        message: 'Account created successfully',
        payload: { user: result.payload.user, tokens: result.payload.tokens }
      } as ISignUpResponse;

      return successResponse;
    }

    return {
      statusCode: constants.api.httpStatusCodes.badRequest,
      message: 'Signup failed',
      payload: undefined
    } as ISignUpResponse;
  } catch (err: any) {
    return {
      statusCode: constants.api.httpStatusCodes.internalServerError,
      message: 'Signup failed',
      payload: undefined
    } as ISignUpResponse;
  }
};


