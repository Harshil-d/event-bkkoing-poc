import { IFetchAllDietitianResponse } from '../dtos/dietitian.dto';
import {
  headersWithAuth,
  wrapErrorResponse,
  wrapResponse,
} from '../helpers/api.helper';
import axios from '../utilities/axios.utility';

export const getAllDietitianList =
  async (): Promise<IFetchAllDietitianResponse> => {
    try {
      const response = await axios.get(`/dietitian/team/all`, {
        headers: headersWithAuth(),
      });

      return wrapResponse<IFetchAllDietitianResponse>(response);
    } catch (err: any) {
      return wrapErrorResponse<IFetchAllDietitianResponse>(err);
    }
  };
