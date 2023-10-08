import { generateRoutesFromPaths } from '@v-notes/shared/helpers';

export const authModulePath = 'auth';
export const authPaths = {
  login: 'login',
  register: 'register'
} as const;
export const authRoutes = generateRoutesFromPaths(authPaths, authModulePath);

export const boardModulePath = 'board';
export const boardPaths = {
  mainBoard: 'main-board',
  board: ':id',
  task: ':boardId/task/:taskId'
} as const;
export const boardRoutes = generateRoutesFromPaths(boardPaths, boardModulePath);

export const taskModulePath = 'task';
export const taskPaths = {
  task: ':id'
} as const;
export const taskRoutes = generateRoutesFromPaths(taskPaths, taskModulePath);
