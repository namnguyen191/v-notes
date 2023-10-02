import { BoardDto, ColumnDto, TaskDto } from './board-api';

export enum BoardSocketEvent {
  joinBoard = 'joinBoard',
  leaveBoard = 'leaveBoard',
  deleteBoard = 'deleteBoard',
  deleteBoardSuccess = 'deleteBoardSuccess',
  deleteBoardFailure = 'deleteBoardFailure',
  updateBoard = 'updateBoard',
  updateBoardSuccess = 'updateBoardSuccess',
  updateBoardFailure = 'updateBoardFailure',
  createColumn = 'createColumn',
  createColumnSuccess = 'createColumnSuccess',
  createColumnFailure = 'createColumnFailure',
  updateColumn = 'updateColumn',
  updateColumnSuccess = 'updateColumnSuccess',
  updateColumnFailure = 'updateColumnFailure',
  deleteColumn = 'deleteColumn',
  deleteColumnSuccess = 'deleteColumnSuccess',
  deleteColumnFailure = 'deleteColumnFailure',
  createTask = 'createTask',
  createTaskSuccess = 'createTaskSuccess',
  createTaskFailure = 'createTaskFailure'
}

type BoardEventPayload<T extends BoardSocketEvent> = T extends
  | BoardSocketEvent.joinBoard
  | BoardSocketEvent.leaveBoard
  | BoardSocketEvent.deleteBoard
  | BoardSocketEvent.deleteBoardSuccess
  ? {
      boardId: string;
    }
  : T extends BoardSocketEvent.updateBoard
  ? {
      boardId: string;
      newTitle: string;
    }
  : T extends BoardSocketEvent.updateBoardSuccess
  ? {
      board: BoardDto;
    }
  : never;

type BoardColumnEventPayload<T extends BoardSocketEvent> =
  T extends BoardSocketEvent.createColumn
    ? { boardId: string; columnTitle: string }
    : T extends
        | BoardSocketEvent.createColumnSuccess
        | BoardSocketEvent.updateColumnSuccess
    ? { column: ColumnDto }
    : T extends BoardSocketEvent.updateColumn
    ? { boardId: string; columnId: string; columnTitle: string }
    : T extends BoardSocketEvent.deleteColumn
    ? { boardId: string; columnId: string }
    : T extends BoardSocketEvent.deleteColumnSuccess
    ? { columnId: string }
    : never;

type TaskEventPayload<T extends BoardSocketEvent> =
  T extends BoardSocketEvent.createTask
    ? { title: string; columnId: string; boardId: string }
    : T extends BoardSocketEvent.createTaskSuccess
    ? { task: TaskDto }
    : never;

export type BoardSocketEventPayload<T extends BoardSocketEvent> =
  | BoardEventPayload<T>
  | BoardColumnEventPayload<T>
  | TaskEventPayload<T>;
