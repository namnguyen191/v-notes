import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SocketService } from '@v-notes/frontend/shared';
import { ColumnDto } from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { BehaviorSubject, Observable } from 'rxjs';

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

export type Column = ColumnDto;

@Injectable({ providedIn: 'root' })
export class ColumnService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _socketService: SocketService = inject(SocketService);

  private readonly BOARD_API_URL = `${env.NX_API_URL}/boards`;

  private _currentColumnsSubject$: BehaviorSubject<
    Column[] | undefined | null
  > = new BehaviorSubject<Column[] | undefined | null>(undefined);

  currentColumns$ = this._currentColumnsSubject$.asObservable();

  fetchCurrentColumnsByBoardId(boardId: string): Observable<Column[]> {
    return this._http.get<Column[]>(`${this.BOARD_API_URL}/${boardId}/columns`);
  }

  setCurrentColumns(columns: Column[]): void {
    this._currentColumnsSubject$.next(columns);
  }

  // leaveCurrentBoard(): void {
  //   this._currentBoardSubject$.next(null);
  //   this._socketService.emit(BoardSocketEvent.leaveBoard, {
  //     boardId: this._currentBoardSubject$.getValue()?.id ?? ''
  //   });
  // }
}
