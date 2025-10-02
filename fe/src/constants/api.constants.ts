export interface IHttpStatusCodes {
  ok: number;
  created: number;
  badRequest: number;
  notFound: number;
  internalServerError: number;
  redirect: number;
  unauthorized: number;
  forbidden: number;
  unprocessableEntity: number;
}

const httpStatusCodes: IHttpStatusCodes = {
  ok: 200,
  created: 201,
  badRequest: 400,
  notFound: 404,
  internalServerError: 500,
  redirect: 302,
  unauthorized: 401,
  forbidden: 403,
  unprocessableEntity: 422,
};

export interface IApiConstants {
  httpStatusCodes: IHttpStatusCodes;
}

export const apiConstants: IApiConstants = {
  httpStatusCodes,
};
