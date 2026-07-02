export interface UserSettingsData {
  id: string;
  userId: string;
  name: string | null;
  theme: string;
  timezone: string;
  weightUnit: string;
  notifications: boolean;
  weekStartsOn: string;
  createdAt: string;
  updatedAt: string;
}
