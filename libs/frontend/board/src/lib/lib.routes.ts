import { Route } from '@angular/router';
import {
  boardModulePath,
  generateRoutesFromPaths,
} from '@v-notes/shared/helpers';
import { MainBoardComponent } from './components/main-board/main-board.component';

const paths = {
  board: 'borad',
} as const;

export const boardRoutes = generateRoutesFromPaths(paths, boardModulePath);

export const frontendBoardRoutes: Route[] = [
  {
    path: paths.board,
    component: MainBoardComponent,
  },
  {
    path: '**',
    redirectTo: paths.board,
    pathMatch: 'full',
  },
];
