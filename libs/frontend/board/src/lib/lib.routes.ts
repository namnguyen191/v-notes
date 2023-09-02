import { Route } from '@angular/router';
import { boardPaths } from '@v-notes/frontend/shared';
import { BoardComponent } from './board.component';

export const frontendBoardRoutes: Route[] = [
  {
    path: '',
    component: BoardComponent,
    children: [
      {
        path: boardPaths.mainBoard,
        loadComponent: () =>
          import('./components/main-board/main-board.component').then(
            (mod) => mod.MainBoardComponent
          ),
      },
      {
        path: boardPaths.board,
        loadComponent: () =>
          import('./components/board/board.component').then(
            (mod) => mod.BoardComponent
          ),
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: boardPaths.mainBoard,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
