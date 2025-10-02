export interface IUser {
  firstName: string;
  lastName?: string;
  role: string;
  dietitianGroupName: string;
}

export interface IUserProfile {
  userName: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  gender: string;
  dob: string;
  contactNumber: string;
  whatsAppNumber?: string;
  role: string;
  dietitianGroupName: string;
}
