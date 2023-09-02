import { Route } from '@angular/router';
import { boardPaths } from '@v-notes/frontend/shared';
import { BoardComponent } from './board.component';
import { MainBoardComponent } from './components/main-board/main-board.component';

export const frontendBoardRoutes: Route[] = [
  {
    path: '',
    component: BoardComponent,
    children: [
      {
        path: boardPaths.mainBoard,
        component: MainBoardComponent,
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
