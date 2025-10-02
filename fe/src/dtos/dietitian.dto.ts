import { IDietitianListItem } from '../interfaces/dietitian.interface';
import { GenericResponse } from './generic.dto';

export interface IFetchAllDietitianResponse
  extends GenericResponse<IDietitianListItem[]> {}
