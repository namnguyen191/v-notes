import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BoardDto } from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { BehaviorSubject, Observable } from 'rxjs';

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

type Board = BoardDto;

@Injectable({ providedIn: 'root' })
export class BoardService {
  private _http: HttpClient = inject(HttpClient);

  private readonly BOARD_API_URL = `${env.NX_API_URL}/boards`;

  private _currentBoardSubject$: BehaviorSubject<Board | undefined> =
    new BehaviorSubject<Board | undefined>(undefined);

  currentBoard$ = this._currentBoardSubject$.asObservable();

  fetchBoardByTitle(title: string): Observable<Board> {
    return this._http.get<Board>(`${this.BOARD_API_URL}/${title}`);
  }

  setCurrentBoard(board: Board): void {
    this._currentBoardSubject$.next(board);
  }
}
