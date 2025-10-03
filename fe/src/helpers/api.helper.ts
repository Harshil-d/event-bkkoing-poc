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
    // Handle network errors or no response
    if (!error.response) {
      return {
        statusCode: 0,
        message: 'Network error - Please check your connection',
        error: 'Network Error',
      } as T;
    }

    const { status, data } = error.response;
    
    // Handle internal server errors
    if (status === constants.api.httpStatusCodes.internalServerError) {
      return {
        statusCode: status,
        message: 'Internal server error - Please try again later',
        error: 'Internal Server Error',
      } as T;
    }

    // Handle unauthorized errors
    if (status === constants.api.httpStatusCodes.unauthorized) {
      clearAuthSession();
      return {
        statusCode: status,
        message: 'Session expired - Please login again',
        error: 'Unauthorized',
      } as T;
    }

    // Extract error message from API response
    const errorMessage = data?.message || data?.error || 'An error occurred';
    
    return {
      ...data,
      statusCode: status,
      message: errorMessage,
    } as T;
  } catch (err) {
    return {
      statusCode: 500,
      message: 'Something went wrong - Please try again',
      error: 'Unknown Error',
    } as T;
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
