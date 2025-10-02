import apiConfig, { IApiConfig } from './api.config';

export interface IConfig {
  api: IApiConfig;
}

const config: IConfig = {
  api: apiConfig,
};

export default config;
