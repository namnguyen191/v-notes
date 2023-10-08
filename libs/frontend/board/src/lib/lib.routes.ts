import { Route } from '@angular/router';
import {
  boardPaths,
  taskModulePath,
  taskPaths
} from '@v-notes/frontend/shared';
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
          )
      },
      {
        path: boardPaths.board,
        loadComponent: () =>
          import('./components/board-detail/board-detail.component').then(
            (mod) => mod.BoardDetailComponent
          ),
        children: [
          {
            path: `${taskModulePath}/${taskPaths.task}`,
            loadComponent: () =>
              import('./components/task/task.component').then(
                (mod) => mod.TaskComponent
              )
          }
        ]
      },
      {
        path: '**',
        redirectTo: boardPaths.mainBoard,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
