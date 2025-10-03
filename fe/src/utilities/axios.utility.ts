import { default as axiosInstance } from 'axios';

import config from '../configurations/index.config';

const axios = axiosInstance.create({
  baseURL: `${config.api.url}`,
});


export default axios;
