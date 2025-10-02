const { REACT_APP_API_URL, REACT_APP_DEFAULT_PAGE_SIZE } = process.env;

export interface IApiConfig {
  url: string;
  pageSize: number;
}

const apiConfig: IApiConfig = {
  url: REACT_APP_API_URL as string,
  pageSize: +(REACT_APP_DEFAULT_PAGE_SIZE || 10),
};

export default apiConfig;
