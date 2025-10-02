export interface IDiet {
  clientId: number;
  dietPreference: string;
  dietaryHabit: string;
  notes: string;
  startDate: string;
  endDate: string;
}

export interface IDietItemSummary {
  id: number;
  email: string;
  client: string;
  startDate: string;
  endDate: string;
  dietPreference: string;
  dietaryHabit: string;
  dietitian: string;
  isActive: boolean;
}
