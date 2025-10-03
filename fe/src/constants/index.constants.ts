import { apiConstants, IApiConstants } from './api.constants';
import { authConstants, IAuthConstants } from './auth.constants';
import { ITextsConstants, textsConstants } from './texts.constants';
import { ROLE_PERMISSIONS, ROLE_NAVIGATION, IRolePermissions, IRoleNavigation } from './role.constants';

export interface IConstants {
  texts: ITextsConstants;
  api: IApiConstants;
  auth: IAuthConstants;
  roles: {
    permissions: Record<string, IRolePermissions>;
    navigation: IRoleNavigation[];
  };
}

export const constants: IConstants = {
  texts: textsConstants,
  api: apiConstants,
  auth: authConstants,
  roles: {
    permissions: ROLE_PERMISSIONS,
    navigation: ROLE_NAVIGATION,
  },
};
