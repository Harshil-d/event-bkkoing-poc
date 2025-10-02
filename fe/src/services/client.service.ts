import { constants } from '../constants/index.constants';
import {
  ICreateClientResponse,
  IFetchAllClientResponse,
  IFetchClientAddressResponse,
  IFetchClientPersonalDetailsResponse,
  IFetchIClientDietaryHistoryResponse,
  IFetchIClientMedicalHistoryResponse,
  IFetchIClientPersonalSocialInformationResponse,
  ISearchClientsResponse,
  IUpdateClientAddressResponse,
  IUpdateClientDietaryHistoryResponse,
  IUpdateClientMedicalHistoryResponse,
  IUpdateClientPersonalSocialInformationResponse,
} from '../dtos/client.dto';
import {
  headersWithAuth,
  wrapErrorResponse,
  wrapResponse,
} from '../helpers/api.helper';
import { IAddress } from '../interfaces/address.interface';
import {
  IClientDietaryHistory,
  IClientMedicalHistory,
  IClientPersonalDetails,
  IClientPersonalSocialInformation,
} from '../interfaces/client.interface';
import { IFormError } from '../interfaces/forms.interface';
import axios from '../utilities/axios.utility';
import { isValidPhoneNumber } from '../utilities/phoneNumber.utility';

export const searchClients = async (
  value: string,
  dietitianId: number,
  status: string,
  gender: string,
  currentPage: number,
  pageSize: number
): Promise<ISearchClientsResponse> => {
  try {
    const response = await axios.post(
      `/client/search`,
      {
        value: value ? value.trim() : '',
        dietitianId: dietitianId > 0 ? dietitianId : undefined,
        isActive:
          status === 'all' ? undefined : status === 'active' ? true : false,
        gender: gender === 'all' ? undefined : gender,
        currentPage,
        pageSize,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<ISearchClientsResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ISearchClientsResponse>(err);
  }
};

export const getAllClientList = async (
  id?: number
): Promise<IFetchAllClientResponse> => {
  const url = id ? `/client/list?currentClientId=${id}` : `/client/list`;

  try {
    const response = await axios.get(url, {
      headers: headersWithAuth(),
    });

    return wrapResponse<IFetchAllClientResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IFetchAllClientResponse>(err);
  }
};

export const createClient = async (
  client: IClientPersonalDetails
): Promise<ICreateClientResponse> => {
  try {
    const {
      email,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      contactNumber,
      whatsAppNumber,
      occupation,
      linkedClientId,
      referredByClientId,
      dietitianId,
      isActive,
    } = client;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (firstName.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'firstName',
        showOnElement: true,
        error: 'Enter first name',
      });
    }

    if (!gender) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'gender',
        showOnElement: true,
        error: 'Select Gender',
      });
    }

    if (dob.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'dob',
        showOnElement: true,
        error: 'Enter date of birth',
      });
    }

    if (
      !(
        contactNumber &&
        /^\+[1-9]\d{1,14}$/.test(contactNumber.replace(/\s+/g, ''))
      )
    ) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'contactNumber',
        showOnElement: true,
        error: 'Enter valid phone number',
      });
    }

    if (
      whatsAppNumber &&
      !/^\+[1-9]\d{1,14}$/.test(whatsAppNumber.replace(/\s+/g, ''))
    ) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'whatsAppNumber',
        showOnElement: true,
        error: 'Enter valid phone number',
      });
    }

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'email',
        showOnElement: true,
        error: 'Enter valid email address',
      });
    }

    if (!occupation) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'occupation',
        showOnElement: true,
        error: 'Enter valid occupation',
      });
    }

    if (!(dietitianId > 0)) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'dietitianId',
        showOnElement: true,
        error: 'Select dietitian',
      });
    }

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      } as unknown as ICreateClientResponse;
    }

    const response = await axios.post(
      `/client/create`,
      {
        email: email.trim(),
        firstName: firstName.trim(),
        middleName: (middleName || '').trim(),
        lastName: (lastName || '').trim(),
        gender,
        dob,
        contactNumber: contactNumber.replace(/\s+/g, ''),
        whatsAppNumber: whatsAppNumber
          ? whatsAppNumber.replace(/\s+/g, '')
          : undefined,
        occupation: (occupation || '').trim(),
        linkedClientId: linkedClientId ? linkedClientId : undefined,
        referredByClientId: referredByClientId ? referredByClientId : undefined,
        dietitianId,
        isActive,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<ICreateClientResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ICreateClientResponse>(err);
  }
};

export const getClientPersonalDetails = async (
  id: number
): Promise<IFetchClientPersonalDetailsResponse> => {
  try {
    const response = await axios.get(`/client/${id}`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<IFetchClientPersonalDetailsResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IFetchClientPersonalDetailsResponse>(err);
  }
};

export const updateClientPersonalDetails = async (
  id: number,
  client: IClientPersonalDetails
): Promise<ICreateClientResponse> => {
  try {
    const {
      email,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      contactNumber,
      whatsAppNumber,
      occupation,
      linkedClientId,
      referredByClientId,
      dietitianId,
      isActive,
      discontinueReason,
    } = client;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (firstName.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'firstName',
        showOnElement: true,
        error: 'Enter first name',
      });
    }

    if (!gender) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'gender',
        showOnElement: true,
        error: 'Select Gender',
      });
    }

    if (dob.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'dob',
        showOnElement: true,
        error: 'Enter date of birth',
      });
    }

    if (!(contactNumber && isValidPhoneNumber(contactNumber))) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'contactNumber',
        showOnElement: true,
        error: 'Enter valid phone number',
      });
    }

    if (
      whatsAppNumber &&
      !/^\+[1-9]\d{1,14}$/.test(whatsAppNumber.replace(/\s+/g, ''))
    ) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'whatsAppNumber',
        showOnElement: true,
        error: 'Enter valid phone number',
      });
    }

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'email',
        showOnElement: true,
        error: 'Enter valid email address',
      });
    }

    if (!(dietitianId > 0)) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'dietitianId',
        showOnElement: true,
        error: 'Select dietitian',
      });
    }

    if (!occupation) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'occupation',
        showOnElement: true,
        error: 'Enter valid occupation',
      });
    }

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      } as unknown as ICreateClientResponse;
    }

    const response = await axios.put(
      `/client/${id}`,
      {
        email: email.trim(),
        firstName: firstName.trim(),
        middleName: (middleName || '').trim(),
        lastName: (lastName || '').trim(),
        gender,
        dob,
        contactNumber: contactNumber.replace(/\s+/g, ''),
        whatsAppNumber: whatsAppNumber
          ? whatsAppNumber.replace(/\s+/g, '')
          : undefined,
        occupation: (occupation || '').trim(),
        linkedClientId: linkedClientId ? linkedClientId : undefined,
        referredByClientId: referredByClientId ? referredByClientId : undefined,
        dietitianId,
        isActive,
        discontinueReason: isActive ? '' : (discontinueReason || '').trim(),
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<ICreateClientResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<ICreateClientResponse>(err);
  }
};

export const getClientAddress = async (
  id: number
): Promise<IFetchClientAddressResponse> => {
  try {
    const response = await axios.get(`/client/${id}/address`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<IFetchClientAddressResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IFetchClientAddressResponse>(err);
  }
};

export const updateClientAddress = async (
  id: number,
  address: IAddress
): Promise<IUpdateClientAddressResponse> => {
  try {
    const {
      houseNumber,
      streetAddress,
      locality,
      landmark,
      cityId,
      stateId,
      pinCode,
      countryId,
    } = address;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (streetAddress.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'streetAddress',
        showOnElement: true,
        error: 'Enter street address',
      });
    }

    if (locality.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'locality',
        showOnElement: true,
        error: 'Enter locality',
      });
    }

    if (!(cityId > 0)) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'cityId',
        showOnElement: true,
        error: 'Select city',
      });
    }

    if (!(stateId > 0)) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'stateId',
        showOnElement: true,
        error: 'Select state',
      });
    }

    if (!(countryId > 0)) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'countryId',
        showOnElement: true,
        error: 'Select country',
      });
    }

    if (pinCode.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'pinCode',
        showOnElement: true,
        error: 'Enter pin code',
      });
    }

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      } as unknown as IUpdateClientAddressResponse;
    }

    const response = await axios.post(
      `/client/${id}/address`,
      {
        houseNumber: houseNumber ? houseNumber.trim() : undefined,
        streetAddress: streetAddress.trim(),
        locality: locality.trim(),
        landmark: landmark ? landmark.trim() : undefined,
        cityId,
        stateId,
        pinCode: pinCode.trim(),
        countryId,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IUpdateClientAddressResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IUpdateClientAddressResponse>(err);
  }
};

export const getClientPersonalSocialInfo = async (
  id: number
): Promise<IFetchIClientPersonalSocialInformationResponse> => {
  try {
    const response = await axios.get(
      `/client/${id}/personal-social-information`,
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IFetchIClientPersonalSocialInformationResponse>(
      response
    );
  } catch (err: any) {
    return wrapErrorResponse<IFetchIClientPersonalSocialInformationResponse>(
      err
    );
  }
};

export const updateClientPersonalSocialInfo = async (
  id: number,
  data: IClientPersonalSocialInformation
): Promise<IUpdateClientPersonalSocialInformationResponse> => {
  try {
    const {
      bowelMovement,
      bowelMovementsNotes,
      sleepQuality,
      sleepQualityNotes,
      smoker,
      smokerNotes,
      alcoholConsumption,
      alcoholConsumptionNotes,
      maritalStatus,
      maritalStatusNotes,
      physicalActivity,
      lifestyleFactors,
      otherInformations,
    } = data;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (bowelMovement === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'bowelMovement',
        showOnElement: true,
        error: 'Select Bowel Movement',
      });
    }

    if (sleepQuality === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'sleepQuality',
        showOnElement: true,
        error: 'Select Sleep Quality',
      });
    }

    if (maritalStatus === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'maritalStatus',
        showOnElement: true,
        error: 'Select Marital Status',
      });
    }

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      } as unknown as IUpdateClientPersonalSocialInformationResponse;
    }

    const response = await axios.post(
      `/client/${id}/personal-social-information`,
      {
        maritalStatus,
        maritalStatusNotes: maritalStatusNotes?.trim() || undefined,
        bowelMovement,
        bowelMovementsNotes: bowelMovementsNotes?.trim() || undefined,
        sleepQuality,
        sleepQualityNotes: sleepQualityNotes?.trim() || undefined,
        smoker,
        smokerNotes: smokerNotes?.trim() || undefined,
        alcoholConsumption,
        alcoholConsumptionNotes: alcoholConsumptionNotes?.trim() || undefined,
        physicalActivity: physicalActivity?.trim() || undefined,
        lifestyleFactors: lifestyleFactors?.trim() || undefined,
        otherInformations: otherInformations?.trim() || undefined,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IUpdateClientPersonalSocialInformationResponse>(
      response
    );
  } catch (err: any) {
    return wrapErrorResponse<IUpdateClientPersonalSocialInformationResponse>(
      err
    );
  }
};

export const getClientMedicalHistory = async (
  id: number
): Promise<IFetchIClientMedicalHistoryResponse> => {
  try {
    const response = await axios.get(`/client/${id}/medical-history`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<IFetchIClientMedicalHistoryResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IFetchIClientMedicalHistoryResponse>(err);
  }
};

export const updateMedicalHistory = async (
  id: number,
  data: IClientMedicalHistory
): Promise<IUpdateClientMedicalHistoryResponse> => {
  try {
    const {
      disease,
      diseaseNotes,
      medication,
      personalHistory,
      familyHistory,
      otherInformations,
    } = data;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (!disease?.length) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'disease',
        showOnElement: true,
        error: 'Select Disease',
      });
    }

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      } as unknown as IUpdateClientMedicalHistoryResponse;
    }

    const response = await axios.post(
      `/client/${id}/medical-history`,
      {
        disease,
        diseaseNotes: diseaseNotes?.trim() || undefined,
        medication: medication?.trim() || undefined,
        personalHistory: personalHistory?.trim() || undefined,
        familyHistory: familyHistory?.trim() || undefined,
        otherInformations: otherInformations?.trim() || undefined,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IUpdateClientMedicalHistoryResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IUpdateClientMedicalHistoryResponse>(err);
  }
};

export const getClientDietaryHistory = async (
  id: number
): Promise<IFetchIClientDietaryHistoryResponse> => {
  try {
    const response = await axios.get(`/client/${id}/dietary-history`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<IFetchIClientDietaryHistoryResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IFetchIClientDietaryHistoryResponse>(err);
  }
};

export const updateClientDietaryHistory = async (
  id: number,
  data: IClientDietaryHistory
): Promise<IUpdateClientDietaryHistoryResponse> => {
  try {
    const {
      wakeupTime,
      sleepTime,
      dietaryHabit,
      favoriteFoods,
      dislikedFoods,
      allergies,
      foodIntolerances,
      nutritionalDeficiencies,
      waterIntake,
      otherInformations,
    } = data;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (wakeupTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(wakeupTime)) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'wakeupTime',
        showOnElement: true,
        error: 'Wakeup Time must be in the HH:MM format',
      });
    }

    if (sleepTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(sleepTime)) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'sleepTime',
        showOnElement: true,
        error: 'Sleep Time must be in the format HH:MM',
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

    if (!allergies.length) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'allergy',
        showOnElement: true,
        error: 'Select Allergy',
      });
    }

    if (!foodIntolerances.length) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'foodIntolerances',
        showOnElement: true,
        error: 'Select Food Intolerances',
      });
    }

    if (!nutritionalDeficiencies.length) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'nutritionalDeficiencies',
        showOnElement: true,
        error: 'Select Nutritional Deficiencies',
      });
    }

    if (!waterIntake) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'waterIntake',
        showOnElement: true,
        error: 'Select Water Intake',
      });
    }

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      } as unknown as IUpdateClientDietaryHistoryResponse;
    }

    const response = await axios.post(
      `/client/${id}/dietary-history`,
      {
        wakeupTime: wakeupTime ? `${wakeupTime?.trim()}:00` : undefined,
        sleepTime: sleepTime ? `${sleepTime?.trim()}:00` : undefined,
        dietaryHabit,
        favoriteFoods: favoriteFoods?.trim() || undefined,
        dislikedFoods: dislikedFoods?.trim() || undefined,
        allergies,
        foodIntolerances,
        nutritionalDeficiencies,
        waterIntake,
        otherInformations: otherInformations?.trim() || undefined,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IUpdateClientDietaryHistoryResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IUpdateClientDietaryHistoryResponse>(err);
  }
};
