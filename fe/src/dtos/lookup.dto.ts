import {
  ICity,
  ICountry,
  ILookupItem,
  IState,
} from '../interfaces/lookup.interface';
import { GenericResponse } from './generic.dto';

export interface ILookupResponse extends GenericResponse<ILookupItem[]> {}
export interface ICountryListResponse extends GenericResponse<ICountry[]> {}
export interface IStateListResponse extends GenericResponse<IState[]> {}
export interface ICityListResponse extends GenericResponse<ICity[]> {}
