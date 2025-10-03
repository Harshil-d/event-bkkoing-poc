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
    // Handle the actual API response structure
    if (response.data && response.data.items) {
      // For list responses (events, bookings) - map items to data and meta to pagination
      const result = {
        statusCode: response.status, // Add the status code from the response
        ...response.data,
        data: response.data.items,
        pagination: response.data.meta,
      } as T;
      
      return result;
    }
    
    // For single item responses - map response.data to payload to match GenericResponse interface
    const result = {
      statusCode: response.status, // Add the status code from the response
      payload: response.data, // Map response.data to payload to match interface
    } as T;
    
    return result;
  } catch (err) {
    throw new Error('Something went wrong');
  }
};

// Special wrapper for event/booking responses that expect 'data' property
export const wrapEventResponse = <T>(response: any): T => {
  try {
    // Handle the actual API response structure
    if (response.data && response.data.items) {
      // For list responses (events, bookings) - map items to data and meta to pagination
      const result = {
        statusCode: response.status, // Add the status code from the response
        ...response.data,
        data: response.data.items,
        pagination: response.data.meta,
      } as T;
      
      return result;
    }
    
    // For single item responses - map response.data to data for event/booking responses
    const result = {
      statusCode: response.status, // Add the status code from the response
      data: response.data, // Map response.data to data for event/booking responses
    } as T;
    
    return result;
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
      // Don't redirect here - let the component handle it
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
