import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BoardDto,
  GetCurrenUserBoardsResponse,
} from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { BehaviorSubject, Observable } from 'rxjs';

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

type Board = BoardDto;

@Injectable({ providedIn: 'root' })
export class BoardService {
  private _http: HttpClient = inject(HttpClient);

  private _currentUserBoardsSubject$: BehaviorSubject<Board[] | undefined> =
    new BehaviorSubject<Board[] | undefined>(undefined);

  currentUserBoards$ = this._currentUserBoardsSubject$.asObservable();

  fetchCurrentUserBoards(): Observable<Board[]> {
    return this._http.get<GetCurrenUserBoardsResponse>(
      `${env.NX_API_URL}/boards`
    );
  }

  setCurrentUserBoards(boards: Board[]): void {
    this._currentUserBoardsSubject$.next(boards);
  }
}
