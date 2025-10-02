import { apiConstants, IApiConstants } from './api.constants';
import { authConstants, IAuthConstants } from './auth.constants';
import { ITextsConstants, textsConstants } from './texts.constants';

export interface IConstants {
  texts: ITextsConstants;
  api: IApiConstants;
  auth: IAuthConstants;
}

export const constants: IConstants = {
  texts: textsConstants,
  api: apiConstants,
  auth: authConstants,
};
