export interface SteamGroup {
  id: number;
  status: GroupStatus;
  link: string;
  userId: number;
  created: Date;
}

export const enum GroupStatus {
    WORKING = 1,
    DONE,
    LOCK,
    PAUSED,
    ERROR
}
