import { IAddress } from '../interfaces/address.interface';
import { IUserProfile } from '../interfaces/user.interface';
import { GenericResponse } from './generic.dto';

export interface IFetchUserDetailsResponse
  extends GenericResponse<{
    firstName: string;
    lastName?: string;
    role: string;
    organizationName?: string;
  }> {}

export interface IFetchUserProfileResponse
  extends GenericResponse<IUserProfile> {}

export interface IUpdateUserProfileResponse extends GenericResponse<null> {}

export interface IChangePasswordResponse extends GenericResponse<null> {}

export interface IFetchUserAddressResponse extends GenericResponse<IAddress> {}

export interface IUpdateUserAddressResponse extends GenericResponse<null> {}
