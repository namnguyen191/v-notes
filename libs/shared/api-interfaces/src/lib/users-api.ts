import { UserFromJwt } from './models';

export type GetUserResponse = {
  id: number;
  email: string;
};

export type GetUserParams = {
  value: string;
  identifier: string;
};

export type GetCurrentuserResponse = UserFromJwt;
