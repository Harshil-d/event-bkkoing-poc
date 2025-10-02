export interface IFieldError {
  name: string;
  showOnElement: boolean;
  error?: string;
}

export interface IFormError {
  hasErrors: boolean;
  errors: string[];
  fields: IFieldError[];
}
