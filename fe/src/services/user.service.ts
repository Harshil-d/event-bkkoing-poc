import { constants } from '../constants/index.constants';
import {
  IChangePasswordResponse,
  IUpdateUserProfileResponse,
  IFetchUserProfileResponse,
  IFetchUserDetailsResponse,
  IFetchUserAddressResponse,
  IUpdateUserAddressResponse,
} from '../dtos/user.dto';
import {
  headersWithAuth,
  wrapErrorResponse,
  wrapResponse,
} from '../helpers/api.helper';
import { IAddress } from '../interfaces/address.interface';
import { IFormError } from '../interfaces/forms.interface';
import { IUserProfile } from '../interfaces/user.interface';
import axios from '../utilities/axios.utility';

export const getUserDetails = async (): Promise<IFetchUserDetailsResponse> => {
  try {
    const response = await axios.get(`/dietitian/profile-summary`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<IFetchUserDetailsResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IFetchUserDetailsResponse>(err);
  }
};

export const getUserProfile = async (): Promise<IFetchUserProfileResponse> => {
  try {
    const response = await axios.get(`/dietitian/profile-details`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<IFetchUserProfileResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IFetchUserProfileResponse>(err);
  }
};

export const updateUserPersonalInfo = async (
  params: IUserProfile
): Promise<IUpdateUserProfileResponse> => {
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
    } = params;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (firstName.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'firstName',
        showOnElement: true,
        error: 'Enter first name',
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

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      } as unknown as IUpdateUserProfileResponse;
    }

    const response = await axios.post(
      `/dietitian/profile-details`,
      {
        email: email.trim(),
        firstName: firstName.trim(),
        middleName: (middleName || '').trim(),
        lastName: (lastName || '').trim(),
        gender,
        dob,
        contactNumber: contactNumber.trim(),
        whatsAppNumber: whatsAppNumber ? whatsAppNumber.trim() : undefined,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IUpdateUserProfileResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IUpdateUserProfileResponse>(err);
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<IChangePasswordResponse> => {
  try {
    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

    if (newPassword !== confirmNewPassword) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'confirmNewPassword',
        showOnElement: true,
        error:
          'New Password & Confirm New Password do not match. Please ensure both passwords are identical.',
      });
    } else if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(
        newPassword
      )
    ) {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'newPassword',
        showOnElement: true,
        error:
          'Password must be a minimum of 8 characters and a maximum of 20 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    if (currentPassword.trim() === '') {
      formError.hasErrors = true;
      formError.fields.push({
        name: 'currentPassword',
        showOnElement: true,
        error: 'Enter current password',
      });
    }

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      };
    }

    const response = await axios.post(
      `/dietitian/change-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IChangePasswordResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IChangePasswordResponse>(err);
  }
};

export const getUserAddress = async (): Promise<IFetchUserAddressResponse> => {
  try {
    const response = await axios.get(`/dietitian/address`, {
      headers: headersWithAuth(),
    });

    return wrapResponse<IFetchUserAddressResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IFetchUserAddressResponse>(err);
  }
};

export const updateUserAddress = async (
  address: IAddress
): Promise<IUpdateUserAddressResponse> => {
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
      } as unknown as IUpdateUserAddressResponse;
    }

    const response = await axios.post(
      `/dietitian/address`,
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

    return wrapResponse<IUpdateUserAddressResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IUpdateUserAddressResponse>(err);
  }
};
