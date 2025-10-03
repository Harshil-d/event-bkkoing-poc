import {
  ICityListResponse,
  ICountryListResponse,
  ILookupResponse,
  IStateListResponse,
} from '../dtos/lookup.dto';
import {
  headersWithAuth,
  wrapErrorResponse,
  wrapResponse,
} from '../helpers/api.helper';
import axios from '../utilities/axios.utility';

export const getCountryList = async (): Promise<ICountryListResponse> => {
  try {
    const response = await axios.get(`/address/countries`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ICountryListResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ICountryListResponse>(err);
  }
};

export const getStateList = async (
  countryId: number
): Promise<IStateListResponse> => {
  try {
    const response = await axios.get(
      `/address/states?countryId=${countryId}&pageSize=50`,
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IStateListResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IStateListResponse>(err);
  }
};

export const getCityList = async (
  stateId: number
): Promise<ICityListResponse> => {
  try {
    const response = await axios.get(
      `/address/cities?stateId=${stateId}&pageSize=50`,
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<ICityListResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ICityListResponse>(err);
  }
};

export const getGenderList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/genders`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

