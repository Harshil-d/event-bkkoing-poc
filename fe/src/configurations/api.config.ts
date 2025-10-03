const { REACT_APP_API_URL, REACT_APP_DEFAULT_PAGE_SIZE } = process.env;

export interface IApiConfig {
  url: string;
  pageSize: number;
}

const apiConfig: IApiConfig = {
  url: REACT_APP_API_URL || 'http://localhost:3001/api',
  pageSize: +(REACT_APP_DEFAULT_PAGE_SIZE || 10),
};

export default apiConfig;
