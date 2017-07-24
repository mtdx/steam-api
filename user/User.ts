export interface User {
  id: number;
  username: string;
  scope: number;
  status: UserStatus;
  createdAt: Date;
}

export const enum UserStatus {
    ACTIVE = 1,
    INACTIVE
}
