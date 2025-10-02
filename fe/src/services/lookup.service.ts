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

export const getDietitianGroupList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/link-types`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

export const getMaritalStatusList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/martial-statuses`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

export const getBowelMovementList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/bowel-movements`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

export const getSleepQualityList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/sleep-qualities`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

export const getDiseasesList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/diseases`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

export const getDietaryHabitsList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/dietary-habits`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

export const getAllergiesList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/allergies`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

export const getFoodIntolerancesList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/food-intolerances`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

export const getNutritionalDeficienciesList =
  async (): Promise<ILookupResponse> => {
    try {
      const response = await axios.get(`/lookup/nutritional-deficiencies`, {
        headers: headersWithAuth(),
      });

      return wrapResponse<ILookupResponse>(response);
    } catch (err: any) {
      return wrapErrorResponse<ILookupResponse>(err);
    }
  };

export const getWaterIntakesList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/water-intakes`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};

export const getDietPreferencesList = async (): Promise<ILookupResponse> => {
  try {
    const response = await axios.get(`/lookup/diet-preferences`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<ILookupResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ILookupResponse>(err);
  }
};
