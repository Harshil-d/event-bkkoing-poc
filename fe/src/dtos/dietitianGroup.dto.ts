import {
  IDietitianGroupLink,
  IDietitianGroupProfile,
} from '../interfaces/dietitianGroup.interface';
import { GenericResponse } from './generic.dto';

export interface IFetchDietitianGroupProfileResponse
  extends GenericResponse<IDietitianGroupProfile> {}

export interface IUpdateDietitianGroupProfileResponse
  extends GenericResponse<null> {}

export interface IFetchDietitianGroupLinksResponse
  extends GenericResponse<IDietitianGroupLink[]> {}

export interface IDietitianGroupLinksResponse extends GenericResponse<null> {}
