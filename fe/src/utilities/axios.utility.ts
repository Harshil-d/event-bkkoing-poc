import { default as axiosInstance } from 'axios';

import config from '../configurations/index.config';
import { headersWithAuth } from '../helpers/api.helper';

const axios = axiosInstance.create({
  baseURL: `${config.api.url}`,
});

// Add request interceptor to automatically include auth headers
axios.interceptors.request.use(
  (config) => {
    const authHeaders = headersWithAuth();
    if (authHeaders.Authorization) {
      config.headers.Authorization = authHeaders.Authorization;
    }
    if (authHeaders['User-Timezone']) {
      config.headers['User-Timezone'] = authHeaders['User-Timezone'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
