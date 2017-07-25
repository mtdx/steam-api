export interface SteamAccount {
  id: number;
  status: SteamAccountStatus;
  account_name: string;
  account_password: string;
  identity_secret: string;
  shared_secret: string;
  user_id?: number;
  created_at: Date;
}

export enum SteamAccountStatus {
  WORKING = 1,
  DONE,
  LOCK,
  PAUSED,
  ERROR
}
