import { UserFromJwt } from '@v-notes/shared/api-interfaces';
import { Request } from 'express';

export type AppRequest = Request & {
  currentUser?: UserFromJwt;
};
