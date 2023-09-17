import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BoardDto,
  CreateBoardRequestBody,
  CreateBoardResponse,
  GetCurrenUserBoardsResponse
} from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { BehaviorSubject, Observable } from 'rxjs';

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

type Board = BoardDto;

@Injectable({ providedIn: 'root' })
export class BoardsService {
  private _http: HttpClient = inject(HttpClient);

  private readonly BOARD_API_URL = `${env.NX_API_URL}/boards`;

  private _currentUserBoardsSubject$: BehaviorSubject<Board[] | undefined> =
    new BehaviorSubject<Board[] | undefined>(undefined);

  currentUserBoards$ = this._currentUserBoardsSubject$.asObservable();

  fetchCurrentUserBoards(): Observable<Board[]> {
    return this._http.get<GetCurrenUserBoardsResponse>(this.BOARD_API_URL);
  }

  createBoard(boardTitle: string): Observable<CreateBoardResponse> {
    const body: CreateBoardRequestBody = {
      title: boardTitle
    };
    return this._http.post<CreateBoardResponse>(this.BOARD_API_URL, body);
  }

  setCurrentUserBoards(boards: Board[]): void {
    this._currentUserBoardsSubject$.next(boards);
  }

  addToCurrentUserBoards(board: Board): void {
    this._currentUserBoardsSubject$.next([
      ...(this._currentUserBoardsSubject$?.value ?? []),
      board
    ]);
  }
}
