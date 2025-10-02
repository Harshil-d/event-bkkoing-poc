import { IFormError } from '../interfaces/forms.interface';

export interface GenericResponse<T> {
  statusCode: number;
  message: string;
  payload?: T;
  fromErrors?: IFormError;
}
