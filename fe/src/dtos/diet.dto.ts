import { IDietItemSummary } from '../interfaces/diet.interface';
import { GenericResponse } from './generic.dto';

export interface ICreateDietResponse extends GenericResponse<{ id: number }> {}

export interface ISearchDietsResponse
  extends GenericResponse<{
    totalRecords: number;
    currentPage: number;
    totalPage: number;
    diets: IDietItemSummary[];
  }> {}
