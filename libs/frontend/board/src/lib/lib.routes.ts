import { Route } from '@angular/router';
import {
  boardModulePath,
  generateRoutesFromPaths,
} from '@v-notes/shared/helpers';
import { MainBoardComponent } from './components/main-board/main-board.component';

const paths = {
  mainBoard: 'main-board',
} as const;

export const boardRoutes = generateRoutesFromPaths(paths, boardModulePath);

export const frontendBoardRoutes: Route[] = [
  {
    path: paths.mainBoard,
    component: MainBoardComponent,
  },
  {
    path: '**',
    redirectTo: paths.mainBoard,
    pathMatch: 'full',
  },
];
