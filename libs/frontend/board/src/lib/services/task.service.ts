import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SocketService } from '@v-notes/frontend/shared';
import {
  BoardSocketEvent,
  BoardSocketEventPayload,
  TaskDto
} from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { BehaviorSubject, Observable } from 'rxjs';

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

export type Task = TaskDto;

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _socketService: SocketService = inject(SocketService);
  private readonly BOARD_API_URL = `${env.NX_API_URL}/boards`;

  private _currentTasksSubject$: BehaviorSubject<Task[] | undefined | null> =
    new BehaviorSubject<Task[] | undefined | null>(undefined);

  currentTasks$ = this._currentTasksSubject$.asObservable();

  fetchCurrentTasksByColumnsId(columnId: string): Observable<Task[]> {
    return this._http.get<Task[]>(
      `${this.BOARD_API_URL}/columns/${columnId}/tasks`
    );
  }

  setCurrentTasks(tasks: Task[] | null): void {
    this._currentTasksSubject$.next(tasks);
  }

  addToCurrentTasks(task: Task): void {
    const newTasks = [...(this._currentTasksSubject$.getValue() ?? []), task];
    this._currentTasksSubject$.next(newTasks);
  }

  updateOneInCurrentTasks(updatedTask: Task): void {
    const oldTasks = this._currentTasksSubject$.getValue() ?? [];

    const newTasks = oldTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );

    this._currentTasksSubject$.next(newTasks);
  }

  removeOneInCurrentTasks(id: string): void {
    const oldTasks = this._currentTasksSubject$.getValue() ?? [];

    const newTasks = oldTasks.filter((task) => task.id !== id);

    this._currentTasksSubject$.next(newTasks);
  }

  createTask(
    payload: BoardSocketEventPayload<BoardSocketEvent.createTask>
  ): void {
    this._socketService.emit(BoardSocketEvent.createTask, payload);
  }

  updateTask(
    payload: BoardSocketEventPayload<BoardSocketEvent.updateTask>
  ): void {
    this._socketService.emit(BoardSocketEvent.updateTask, payload);
  }

  deleteTask(
    payload: BoardSocketEventPayload<BoardSocketEvent.deleteTask>
  ): void {
    this._socketService.emit(BoardSocketEvent.deleteTask, payload);
  }
}
