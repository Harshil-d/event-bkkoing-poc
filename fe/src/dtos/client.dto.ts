import { IAddress } from '../interfaces/address.interface';
import {
  IClientDietaryHistory,
  IClientListItem,
  IClientMedicalHistory,
  IClientPersonalDetails,
  IClientPersonalSocialInformation,
  IClientSummary,
} from '../interfaces/client.interface';
import { GenericResponse } from './generic.dto';

export interface ISearchClientsResponse
  extends GenericResponse<{
    totalRecords: number;
    clients: IClientSummary[];
  }> {}

export interface IFetchAllClientResponse
  extends GenericResponse<IClientListItem[]> {}

export interface ICreateClientResponse
  extends GenericResponse<{ id: number }> {}

export interface IFetchClientPersonalDetailsResponse
  extends GenericResponse<IClientPersonalDetails> {}

export interface IUpdateClientPersonalDetailsResponse
  extends GenericResponse<void> {}

export interface IFetchClientAddressResponse
  extends GenericResponse<IAddress> {}

export interface IUpdateClientAddressResponse extends GenericResponse<null> {}

export interface IFetchIClientPersonalSocialInformationResponse
  extends GenericResponse<IClientPersonalSocialInformation> {}

export interface IUpdateClientPersonalSocialInformationResponse
  extends GenericResponse<null> {}

export interface IFetchIClientMedicalHistoryResponse
  extends GenericResponse<IClientMedicalHistory> {}

export interface IUpdateClientMedicalHistoryResponse
  extends GenericResponse<null> {}

export interface IFetchIClientDietaryHistoryResponse
  extends GenericResponse<IClientDietaryHistory> {}

export interface IUpdateClientDietaryHistoryResponse
  extends GenericResponse<null> {}
