import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { boardRoutes } from '@v-notes/frontend/shared';
import {
  ButtonModule,
  DropdownModule,
  IconModule,
  InputModule,
  ListItem,
  ModalModule
} from 'carbon-components-angular';
import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap
} from 'rxjs';
import { Column, ColumnService } from '../../services/column.service';
import { Task, TaskService } from '../../services/task.service';
import { ColumnsToListItemPipe } from './columns-to-list-item.pipe';

@Component({
  selector: 'v-notes-lib-task',
  standalone: true,
  imports: [
    CommonModule,
    ModalModule,
    ButtonModule,
    DropdownModule,
    IconModule,
    InputModule,
    ColumnsToListItemPipe
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  private readonly _router: Router = inject(Router);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _taskService: TaskService = inject(TaskService);
  private readonly _columnService: ColumnService = inject(ColumnService);

  private _taskTitleInputSubject: Subject<string> = new Subject<string>();
  private _taskDescInputSubject: Subject<string> = new Subject<string>();

  data$: Observable<{
    task: Task;
    columns: Column[];
  }>;
  items: ListItem[] = [
    {
      content: 'Hi',
      selected: true
    }
  ];
  currentTaskId: string;
  currentBoardId: string;
  isConfirmDeleteTaskOpen = signal<boolean>(false);

  constructor() {
    const taskIdFromParam = this._activatedRoute.snapshot.paramMap.get('id');
    if (!taskIdFromParam) {
      throw new Error('Missing task id in url');
    }
    this.currentTaskId = taskIdFromParam;

    const boardIdFromParam =
      this._activatedRoute.parent?.snapshot.paramMap.get('id');
    if (!boardIdFromParam) {
      throw new Error('Missing board id in url');
    }
    this.currentBoardId = boardIdFromParam;

    this.data$ = combineLatest([
      this._taskService.currentTasks$.pipe(
        filter((tasks): tasks is Task[] => !!tasks),
        map((tasks) => {
          const foundTask = tasks.find(
            (task) => task.id === this.currentTaskId
          );
          if (!foundTask) {
            throw new Error(
              'could not find task with this id: ' + this.currentTaskId
            );
          }
          return foundTask;
        })
      ),
      this._columnService.currentColumns$.pipe(
        filter((cols): cols is Column[] => !!cols)
      )
    ]).pipe(map(([task, columns]) => ({ task, columns })));

    this._taskTitleInputSubject
      .pipe(
        takeUntilDestroyed(),
        debounceTime(500),
        filter((title) => !!title),
        distinctUntilChanged(),
        tap((title) =>
          this._taskService.updateTask({
            taskId: this.currentTaskId,
            boardId: this.currentBoardId,
            newTitle: title
          })
        )
      )
      .subscribe();

    this._taskDescInputSubject
      .pipe(
        takeUntilDestroyed(),
        debounceTime(500),
        filter((desc) => !!desc),
        distinctUntilChanged(),
        tap((desc) =>
          this._taskService.updateTask({
            taskId: this.currentTaskId,
            boardId: this.currentBoardId,
            newDescription: desc
          })
        )
      )
      .subscribe();
  }

  changeTaskColumn(e: object): void {
    const { item } = e as ListItem;
    this._taskService.updateTask({
      taskId: this.currentTaskId,
      boardId: this.currentBoardId,
      newColumn: item.columnId
    });
  }

  changeTaskTitle(e: Event) {
    const newTitle = (e.target as HTMLInputElement).value;

    this._taskTitleInputSubject.next(newTitle);
  }

  changeTaskDescription(e: Event) {
    const newDesc = (e.target as HTMLInputElement).value;

    this._taskDescInputSubject.next(newDesc);
  }

  onConfirmDeleteTask() {
    this._taskService.deleteTask({
      taskId: this.currentTaskId,
      boardId: this.currentBoardId
    });

    this.closeModal();
  }

  closeModal(): void {
    const parentBoardId =
      this._activatedRoute.snapshot.parent?.paramMap.get('id');

    if (!parentBoardId) {
      this._router.navigateByUrl(boardRoutes.mainBoard);
      return;
    }

    this._router.navigateByUrl(boardRoutes.board({ id: parentBoardId }));
  }
}
