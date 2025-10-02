import { constants } from '../constants/index.constants';
import {
  IDietitianGroupLinksResponse,
  IFetchDietitianGroupLinksResponse,
  IFetchDietitianGroupProfileResponse,
  IUpdateDietitianGroupProfileResponse,
} from '../dtos/dietitianGroup.dto';
import {
  headersWithAuth,
  wrapErrorResponse,
  wrapResponse,
} from '../helpers/api.helper';
import {
  IDietitianGroupLink,
  IDietitianGroupProfile,
} from '../interfaces/dietitianGroup.interface';
import { IFormError } from '../interfaces/forms.interface';
import axios from '../utilities/axios.utility';

export const getDietitianGroupProfile =
  async (): Promise<IFetchDietitianGroupProfileResponse> => {
    try {
      const response = await axios.get(`/dietitian/group/profile`, {
        headers: headersWithAuth(),
      });

      return wrapResponse<IFetchDietitianGroupProfileResponse>(response);
    } catch (err: any) {
      return wrapErrorResponse<IFetchDietitianGroupProfileResponse>(err);
    }
  };

export const updateDietitianGroupProfile = async (
  params: IDietitianGroupProfile
): Promise<IUpdateDietitianGroupProfileResponse> => {
  try {
    const { tagLine, email, contactNumber, whatsAppNumber } = params;

    const formError: IFormError = { hasErrors: false, errors: [], fields: [] };

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
      } as unknown as IUpdateDietitianGroupProfileResponse;
    }

    const response = await axios.put(
      `/dietitian/group/profile`,
      {
        tagLine: tagLine ? tagLine.trim() : tagLine,
        email: email.trim(),
        contactNumber: contactNumber.replace(/\s+/g, ''),
        whatsAppNumber: whatsAppNumber
          ? whatsAppNumber.replace(/\s+/g, '')
          : undefined,
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IUpdateDietitianGroupProfileResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IUpdateDietitianGroupProfileResponse>(err);
  }
};

export const getDietitianGroupLinks =
  async (): Promise<IFetchDietitianGroupLinksResponse> => {
    try {
      const response = await axios.get(`/dietitian/group-links`, {
        headers: headersWithAuth(),
      });

      return wrapResponse<IFetchDietitianGroupLinksResponse>(response);
    } catch (err: any) {
      return wrapErrorResponse<IFetchDietitianGroupLinksResponse>(err);
    }
  };

export const updateDietitianGroupLinks = async (
  links: IDietitianGroupLink[]
): Promise<IDietitianGroupLinksResponse> => {
  try {
    const formError: IFormError = {
      hasErrors: false,
      errors: [],
      fields: [],
    };

    for (const link of links) {
      if (
        link.link &&
        !/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
          link.link
        )
      ) {
        formError.hasErrors = true;
        formError.fields.push({
          name: link.linkType,
          showOnElement: true,
          error: 'Enter valid link',
        });
      }
    }

    if (formError.hasErrors) {
      return {
        statusCode: constants.api.httpStatusCodes.unprocessableEntity,
        message: 'Unprocessable Entity',
        fromErrors: formError,
      } as unknown as IDietitianGroupLinksResponse;
    }

    const response = await axios.post(
      `/dietitian/group-links`,
      {
        links: links.map((item) => ({
          ...item,
          link: item ? item.link.trim() : '',
        })),
      },
      {
        headers: headersWithAuth(),
      }
    );

    return wrapResponse<IDietitianGroupLinksResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IDietitianGroupLinksResponse>(err);
  }
};
