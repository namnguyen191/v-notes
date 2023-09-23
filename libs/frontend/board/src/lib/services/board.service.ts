import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SocketService } from '@v-notes/frontend/shared';
import { BoardDto, BoardSocketEvent } from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { BehaviorSubject, Observable } from 'rxjs';

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

export type Board = BoardDto;

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _socketService: SocketService = inject(SocketService);

  private readonly BOARD_API_URL = `${env.NX_API_URL}/boards`;

  private _currentBoardSubject$: BehaviorSubject<Board | undefined | null> =
    new BehaviorSubject<Board | undefined | null>(undefined);

  currentBoard$ = this._currentBoardSubject$.asObservable();

  fetchBoardById(id: string): Observable<Board> {
    return this._http.get<Board>(`${this.BOARD_API_URL}/${id}`);
  }

  setCurrentBoard(board: Board): void {
    this._currentBoardSubject$.next(board);
  }

  leaveCurrentBoard(): void {
    this._currentBoardSubject$.next(null);
    this._socketService.emit(BoardSocketEvent.leaveBoard, {
      boardId: this._currentBoardSubject$.getValue()?.id ?? ''
    });
  }
}
