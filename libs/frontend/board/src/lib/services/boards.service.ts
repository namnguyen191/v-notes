import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SocketService } from '@v-notes/frontend/shared';
import {
  BoardDto,
  BoardSocketEvent,
  CreateBoardRequestBody,
  CreateBoardResponse,
  GetAllBoardsResponse
} from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { BehaviorSubject, Observable } from 'rxjs';

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

type Board = BoardDto;

@Injectable({ providedIn: 'root' })
export class BoardsService {
  private _http: HttpClient = inject(HttpClient);
  private readonly _socketService: SocketService = inject(SocketService);

  private readonly BOARD_API_URL = `${env.NX_API_URL}/boards`;

  private _currentUserBoardsSubject$: BehaviorSubject<Board[] | undefined> =
    new BehaviorSubject<Board[] | undefined>(undefined);

  currentUserBoards$ = this._currentUserBoardsSubject$.asObservable();

  fetchAllBoards(): Observable<Board[]> {
    return this._http.get<GetAllBoardsResponse>(this.BOARD_API_URL);
  }

  createBoard(boardTitle: string): Observable<CreateBoardResponse> {
    const body: CreateBoardRequestBody = {
      title: boardTitle
    };
    return this._http.post<CreateBoardResponse>(this.BOARD_API_URL, body);
  }

  deleteBoard(boardId: string): void {
    this._socketService.emit(BoardSocketEvent.deleteBoard, { boardId });
  }

  updateBoard(boardId: string, newTitle: string): void {
    this._socketService.emit(BoardSocketEvent.updateBoard, {
      boardId,
      newTitle
    });
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

  removeFromCurrentUserBoards(boardId: string): void {
    this._currentUserBoardsSubject$.next(
      (this._currentUserBoardsSubject$?.value ?? []).filter(
        (board) => board.id !== boardId
      )
    );
  }

  updateOneInCurrentUserBoards(newBoard: Board): void {
    this._currentUserBoardsSubject$.next(
      (this._currentUserBoardsSubject$?.value ?? []).map((board) =>
        board.id === newBoard.id ? newBoard : board
      )
    );
  }
}
