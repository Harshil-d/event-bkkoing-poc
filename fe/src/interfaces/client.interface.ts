export interface IClientSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  contactNumber: string;
  dietitian: number;
  isActive: boolean;
  createdAt: Date;
}

export interface IClientListItem {
  id: number;
  firstName: string;
  lastName: string;
}

export interface IClientPersonalDetails {
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  gender: string;
  dob: string;
  contactNumber: string;
  whatsAppNumber?: string;
  occupation: string;
  linkedClientId?: number;
  referredByClientId?: number;
  dietitianId: number;
  isActive: boolean;
  discontinueReason?: string;
}

export interface IClientPersonalSocialInformation {
  bowelMovement: string;
  bowelMovementsNotes: string;
  sleepQuality: string;
  sleepQualityNotes: string;
  smoker: boolean;
  smokerNotes: string;
  alcoholConsumption: boolean;
  alcoholConsumptionNotes: string;
  maritalStatus: string;
  maritalStatusNotes: string;
  physicalActivity: string;
  lifestyleFactors: string;
  otherInformations: string;
}

export interface IClientMedicalHistory {
  disease?: string[];
  diseaseNotes?: string;
  medication?: string;
  personalHistory?: string;
  familyHistory?: string;
  otherInformations?: string;
}

export interface IClientDietaryHistory {
  wakeupTime?: string;
  sleepTime?: string;
  dietaryHabit: string;
  favoriteFoods?: string;
  dislikedFoods?: string;
  allergies: string[];
  foodIntolerances: string[];
  nutritionalDeficiencies: string[];
  waterIntake: string;
  otherInformations?: string;
}
