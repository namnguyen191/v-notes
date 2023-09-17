import { UserFromJwt } from '@v-notes/shared/api-interfaces';
import { Request } from 'express';
import { Socket } from 'socket.io';

export type AppRequest = Request & {
  currentUser?: UserFromJwt;
};

export type AppWSClient = Socket & {
  currentUser?: UserFromJwt;
};
