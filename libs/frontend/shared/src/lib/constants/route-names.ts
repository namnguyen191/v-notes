import { generateRoutesFromPaths } from '@v-notes/shared/helpers';

export const authModulePath = 'auth';
export const authPaths = {
  login: 'login',
  register: 'register',
} as const;
export const authRoutes = generateRoutesFromPaths(authPaths, authModulePath);

export const boardModulePath = 'board';
export const boardPaths = {
  mainBoard: 'main-board',
  board: ':title',
} as const;
export const boardRoutes = generateRoutesFromPaths(boardPaths, boardModulePath);
