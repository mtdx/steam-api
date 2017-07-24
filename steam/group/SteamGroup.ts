export interface SteamGroup {
  id: number;
  status: SteamGroupStatus;
  group_link: string;
  user_id?: number;
  created_at: Date;
}

export enum SteamGroupStatus {
  WORKING = 1,
  DONE,
  LOCK,
  PAUSED,
  ERROR
}
