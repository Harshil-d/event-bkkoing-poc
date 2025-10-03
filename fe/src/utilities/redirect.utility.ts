import { NavigateFunction } from 'react-router-dom';

/**
 * Handles successful authentication redirection
 * @param navigate - React Router navigate function
 * @param delay - Delay in milliseconds before redirect (default: 500ms)
 * @param replace - Whether to replace current history entry (default: true)
 */
export const handleAuthSuccess = (
  navigate: NavigateFunction,
  delay: number = 500,
  replace: boolean = true
) => {
  
  setTimeout(() => {
    navigate('/events', { replace });
  }, delay);
};

/**
 * Handles authentication error with user feedback
 * @param error - Error message to display
 * @param setError - Function to set error state
 * @param setLoading - Function to set loading state
 */
export const handleAuthError = (
  error: string,
  setError: (error: string) => void,
  setLoading?: (loading: boolean) => void
) => {
  setError(error);
  if (setLoading) {
    setLoading(false);
  }
};

/**
 * Validates if user is authenticated by checking localStorage
 * @returns boolean indicating if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  const { accessTokenKey } = require('../constants/auth.constants').authTokenKeys;
  const accessToken = localStorage.getItem(accessTokenKey);
  return !!accessToken;
};

/**
 * Clears authentication data from localStorage
 */
export const clearAuthData = () => {
  const { 
    accessTokenKey, 
    accessTokenExpiryTimeKey, 
    refreshTokenKey, 
    refreshTokenExpiryTimeKey, 
    signInRoleKey 
  } = require('../constants/auth.constants').authTokenKeys;
  
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(accessTokenExpiryTimeKey);
  localStorage.removeItem(refreshTokenKey);
  localStorage.removeItem(refreshTokenExpiryTimeKey);
  localStorage.removeItem(signInRoleKey);
  
};
