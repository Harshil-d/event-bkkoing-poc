import { constants } from '../constants/index.constants';
import { getTimeZone } from './dateTime.helper';

export const clearAuthSession = () => {
  const {
    refreshTokenKey,
    refreshTokenExpiryTimeKey,
    accessTokenKey,
    accessTokenExpiryTimeKey,
    signInRoleKey,
  } = constants.auth.authTokenKeys;

  localStorage.removeItem(refreshTokenKey);
  localStorage.removeItem(refreshTokenExpiryTimeKey);
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(accessTokenExpiryTimeKey);
  localStorage.removeItem(signInRoleKey);
};

export const wrapResponse = <T>(response: any): T => {
  try {
    return {
      ...response.data,
    } as T;
  } catch (err) {
    throw new Error('Something went wrong');
  }
};

export const wrapErrorResponse = <T>(error: any): T => {
  try {
    if (
      error.response.status ===
      constants.api.httpStatusCodes.internalServerError
    ) {
      throw new Error('Something went wrong');
    }

    if (error.response.status === constants.api.httpStatusCodes.unauthorized) {
      clearAuthSession();
      window.location.href = '/sign-in';
    }

    return {
      ...error.response.data,
      statusCode: error.response.status,
    } as T;
  } catch (err) {
    throw new Error('Something went wrong');
  }
};

export const headersWithAuth = () => {
  const { accessTokenKey } = constants.auth.authTokenKeys;
  const accessToken = localStorage.getItem(accessTokenKey);

  return {
    Authorization: `Bearer ${accessToken}`,
    'User-Timezone': getTimeZone(),
  };
};
