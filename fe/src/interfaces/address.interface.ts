export interface IAddress {
  houseNumber?: string;
  streetAddress: string;
  locality: string;
  landmark?: string;
  cityId: number;
  stateId: number;
  pinCode: string;
  countryId: number;
}
