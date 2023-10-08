import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AuthService,
  CurrentUser,
  SocketService,
  boardRoutes,
  taskRoutes
} from '@v-notes/frontend/shared';
import { BoardSocketEvent } from '@v-notes/shared/api-interfaces';
import {
  ButtonModule,
  IconModule,
  ModalModule
} from 'carbon-components-angular';
import {
  Observable,
  combineLatest,
  filter,
  forkJoin,
  map,
  of,
  switchMap
} from 'rxjs';
import { Board, BoardService } from '../../services/board.service';
import { BoardsService } from '../../services/boards.service';
import { Column, ColumnService } from '../../services/column.service';
import { Task, TaskService } from '../../services/task.service';
import { InlineFormComponent } from '../inline-form/inline-form.component';
import { FilterTasksPipe } from './filter-tasks.pipe';

@Component({
  selector: 'v-notes-lib-board-detail',
  standalone: true,
  imports: [
    CommonModule,
    InlineFormComponent,
    FilterTasksPipe,
    ButtonModule,
    ModalModule,
    IconModule,
    RouterModule
  ],
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardDetailComponent implements OnInit, OnDestroy {
  private readonly _boardService: BoardService = inject(BoardService);
  private readonly _boardsService: BoardsService = inject(BoardsService);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);
  private readonly _socketService: SocketService = inject(SocketService);
  private readonly _columnService: ColumnService = inject(ColumnService);
  private readonly _taskService: TaskService = inject(TaskService);
  private readonly _authService: AuthService = inject(AuthService);

  taskRoutes = taskRoutes;
  data$: Observable<{
    currentUser: CurrentUser;
    currentBoard: Board;
    columns: Column[];
    tasks: Task[];
  }>;
  boardId: string | null = null;
  deleteColumnModalState = signal<{
    isOpen: boolean;
    columnId: string | null;
  }>({
    isOpen: false,
    columnId: null
  });
  deleteBoardModalState = signal<{
    isOpen: boolean;
    boardId: string | null;
  }>({
    isOpen: false,
    boardId: null
  });

  constructor() {
    this.data$ = combineLatest([
      this._authService.currentUser$.pipe(
        filter((usr): usr is CurrentUser => !!usr)
      ),
      this._boardService.currentBoard$.pipe(
        filter((board): board is Board => !!board)
      ),
      this._columnService.currentColumns$.pipe(
        filter((columns): columns is Column[] => !!columns)
      ),
      this._taskService.currentTasks$.pipe(
        filter((tasks): tasks is Task[] => !!tasks)
      )
    ]).pipe(
      takeUntilDestroyed(),
      map(([currentUser, currentBoard, columns, tasks]) => ({
        currentUser,
        currentBoard,
        columns,
        tasks
      }))
    );

    this._initializedListener();
  }
  ngOnDestroy(): void {
    this._boardService.leaveCurrentBoard();
  }

  ngOnInit(): void {
    this.boardId = this._route.snapshot.paramMap.get('id');
    this._fetchData();
  }

  private _fetchData(): void {
    const boardId = this.boardId;
    if (!boardId) {
      console.error('Missing board id in url parameter');
      return;
    }

    this._boardService.fetchBoardById(boardId).subscribe({
      next: (board) => {
        this._boardService.setCurrentBoard(board);

        this._socketService.emit(BoardSocketEvent.joinBoard, {
          boardId
        });
      }
    });

    this._columnService
      .fetchCurrentColumnsByBoardId(boardId)
      .pipe(
        switchMap((columns) => {
          this._columnService.setCurrentColumns(columns);
          const tasksRequests = columns.map((col) =>
            this._taskService.fetchCurrentTasksByColumnsId(col.id)
          );

          if (!tasksRequests.length) {
            return of([]);
          }

          return forkJoin(tasksRequests);
        })
      )
      .subscribe({
        next: (tasksPerColumns: Task[][]) => {
          this._taskService.setCurrentTasks(
            tasksPerColumns.reduce((acc, cur) => [...acc, ...cur], [])
          );
        }
      });
  }

  onNewBoardTitleSubmitted(newBoardTitle: string): void {
    if (!this.boardId) {
      return;
    }

    this._boardsService.updateBoard(this.boardId, newBoardTitle);
  }

  onColumnNameSubmitted(columnName: string): void {
    if (!this.boardId) {
      console.error('Missing board id in url parameter');
      return;
    }

    this._columnService.createColumn({
      boardId: this.boardId,
      columnTitle: columnName
    });
  }

  onUpdatedColumnNameSubmitted(newColumnName: string, columnId: string): void {
    if (!this.boardId) {
      console.error('Missing board id in url parameter');
      return;
    }

    this._columnService.updateColumn({
      boardId: this.boardId,
      columnId,
      columnTitle: newColumnName
    });
  }

  onTaskNameSubmitted(taskName: string, columnId: string): void {
    if (!this.boardId) {
      console.error('Missing board id in url parameter');
      return;
    }

    this._taskService.createTask({
      boardId: this.boardId,
      columnId,
      title: taskName
    });
  }

  onDeleteColumnClick(columnId: string): void {
    this.deleteColumnModalState.set({ isOpen: true, columnId });
  }

  onDeleteBoardClick(boardId: string): void {
    this.deleteBoardModalState.set({ isOpen: true, boardId });
  }

  onConfirmDeleteColumn(): void {
    const columnId = this.deleteColumnModalState().columnId;

    if (columnId && this.boardId) {
      this._columnService.deleteColumn({ boardId: this.boardId, columnId });
    }

    this.deleteColumnModalState.set({ isOpen: false, columnId: null });
  }

  onConfirmDeleteBoard(): void {
    const boardId = this.deleteBoardModalState().boardId;

    if (boardId) {
      this._boardsService.deleteBoard(boardId);
    }

    this.deleteBoardModalState.set({ isOpen: false, boardId: null });
  }

  openModal() {
    this.deleteColumnModalState.update((old) => ({ ...old, isOpen: true }));
  }

  openDeleteBoardModal() {
    this.deleteBoardModalState.update((old) => ({ ...old, isOpen: true }));
  }

  closeModal() {
    this.deleteColumnModalState.update((old) => ({ ...old, isOpen: false }));
  }

  closeDeleteBoardModal() {
    this.deleteBoardModalState.update((old) => ({ ...old, isOpen: false }));
  }

  private _initializedListener(): void {
    this._socketService
      .listen(BoardSocketEvent.createColumnSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ column }) =>
        this._columnService.addToCurrentColumns(column)
      );

    this._socketService
      .listen(BoardSocketEvent.createTaskSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ task }) => {
        this._taskService.addToCurrentTasks(task);
      });

    this._socketService
      .listen(BoardSocketEvent.updateColumnSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ column }) => {
        this._columnService.updateCurrentColumn(column);
      });

    this._socketService
      .listen(BoardSocketEvent.deleteColumnSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ columnId }) => {
        this._columnService.removeFromCurrentColumns(columnId);
      });

    this._socketService
      .listen(BoardSocketEvent.deleteBoardSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ boardId }) => {
        this._boardsService.removeFromCurrentUserBoards(boardId);
        if (this.boardId === boardId) {
          this._router.navigateByUrl(boardRoutes.mainBoard);
        }
      });

    this._socketService
      .listen(BoardSocketEvent.updateBoardSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ board }) => {
        this._boardsService.updateOneInCurrentUserBoards(board);
        this._boardService.setCurrentBoard(board);
      });

    this._socketService
      .listen(BoardSocketEvent.updateTaskSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ task }) => {
        this._taskService.updateOneInCurrentTasks(task);
      });

    this._socketService
      .listen(BoardSocketEvent.deleteTaskSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ taskId }) => {
        this._taskService.removeOneInCurrentTasks(taskId);
      });
  }
}
