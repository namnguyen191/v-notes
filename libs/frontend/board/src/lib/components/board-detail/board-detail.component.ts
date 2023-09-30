import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { SocketService } from '@v-notes/frontend/shared';
import { BoardSocketEvent } from '@v-notes/shared/api-interfaces';
import { ButtonModule, ModalModule } from 'carbon-components-angular';
import {
  Observable,
  combineLatest,
  filter,
  forkJoin,
  map,
  switchMap
} from 'rxjs';
import { Board, BoardService } from '../../services/board.service';
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
    ModalModule
  ],
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardDetailComponent implements OnInit {
  private readonly _boardService: BoardService = inject(BoardService);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);
  private readonly _socketService: SocketService = inject(SocketService);
  private readonly _columnService: ColumnService = inject(ColumnService);
  private readonly _taskService: TaskService = inject(TaskService);

  data$: Observable<{
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

  constructor() {
    this.data$ = combineLatest([
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
      map(([currentBoard, columns, tasks]) => ({
        currentBoard,
        columns,
        tasks
      }))
    );

    this._initializedListener();
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

  onConfirmDeleteColumn(): void {
    const columnId = this.deleteColumnModalState().columnId;

    if (columnId && this.boardId) {
      this._columnService.deleteColumn({ boardId: this.boardId, columnId });
    }

    this.deleteColumnModalState.set({ isOpen: false, columnId: null });
  }

  openModal() {
    this.deleteColumnModalState.update((old) => ({ ...old, isOpen: true }));
  }

  closeModal() {
    this.deleteColumnModalState.update((old) => ({ ...old, isOpen: false }));
  }

  private _initializedListener(): void {
    this._router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this._boardService.leaveCurrentBoard();
      }
    });

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
        console.log('Nam data is: removed', columnId);
        this._columnService.removeFromCurrentColumns(columnId);
      });
  }
}
