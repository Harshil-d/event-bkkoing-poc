import { constants } from '../constants/index.constants';
import { ICreateDietResponse, ISearchDietsResponse } from '../dtos/diet.dto';
import {
  headersWithAuth,
  wrapErrorResponse,
  wrapResponse,
} from '../helpers/api.helper';
import { IDiet } from '../interfaces/diet.interface';
import { IFormError } from '../interfaces/forms.interface';
import axios from '../utilities/axios.utility';

export const createDiet = async (dto: IDiet): Promise<ICreateDietResponse> => {
  try {
    const { clientId, dietPreference, dietaryHabit, notes, startDate } = dto;
    let { endDate } = dto;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (dietPreference === 'DAILY') {
      endDate = startDate;
    }

    if (!clientId) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'clientId',
        showOnElement: true,
        error: 'Select Client',
      });
    }

    if (!dietPreference) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'dietPreference',
        showOnElement: true,
        error: 'Select Diet Preference',
      });
    }

    if (!dietaryHabit) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'dietaryHabit',
        showOnElement: true,
        error: 'Select Dietary Habit',
      });
    }

    if (!startDate) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'startDate',
        showOnElement: true,
        error: 'Enter Start Date',
      });
    }

    if (!endDate) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'endDate',
        showOnElement: true,
        error: 'Enter End Date',
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'endDate',
        showOnElement: true,
        error: 'End date must be later than the Start Date',
      });
    }

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      } as unknown as ICreateDietResponse;
    }

    const response = await axios.post(
      `/diet/create`,
      {
        clientId,
        dietPreference,
        dietaryHabit,
        notes: (notes || '').trim(),
        startDate,
        endDate,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<ICreateDietResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ICreateDietResponse>(err);
  }
};

export const searchDiets = async (
  value: string,
  startDate: string,
  endDate: string,
  dietitianId: number,
  dietPreference: string,
  dietaryHabit: string,
  currentPage: number,
  pageSize: number
): Promise<ISearchDietsResponse> => {
  try {
    const response = await axios.post(
      `/diet/search`,
      {
        value: value ? value.trim() : '',
        startDate: startDate || '',
        endDate: endDate || '',
        dietitianId: dietitianId > 0 ? dietitianId : undefined,
        dietPreference: dietPreference === 'all' ? undefined : dietPreference,
        dietaryHabit: dietaryHabit === 'all' ? undefined : dietaryHabit,
        currentPage,
        pageSize,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<ISearchDietsResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ISearchDietsResponse>(err);
  }
};
