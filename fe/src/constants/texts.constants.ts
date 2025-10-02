export interface ISuccessMessages {}

const successMessages: ISuccessMessages = {};

export interface IErrorMessages {
  somethingWentWrongError: string;
  forbiddenError: string;
  notFoundError: string;
}

const errorMessages: IErrorMessages = {
  somethingWentWrongError: `Something's not working. It's not you, it's us.`,
  forbiddenError: `We apologize, but you are not permitted to proceed.`,
  notFoundError: `We couldn't find the page you are looking for ...`,
};

export interface ITextsConstants {
  successMessages: ISuccessMessages;
  errorMessages: IErrorMessages;
}

export const textsConstants: ITextsConstants = {
  successMessages,
  errorMessages,
};
