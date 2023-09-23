import { ColumnDto } from './board-api';

export enum BoardSocketEvent {
  joinBoard = 'joinBoard',
  leaveBoard = 'leaveBoard',
  createColumn = 'createColumn',
  createColumnSuccess = 'createColumnSuccess',
  createColumnFailure = 'createColumnFailure'
}

export type BoardSocketEventPayload<T extends BoardSocketEvent> = T extends
  | BoardSocketEvent.joinBoard
  | BoardSocketEvent.leaveBoard
  ? {
      boardId: string;
    }
  : T extends BoardSocketEvent.createColumn
  ? { boardId: string; columnTitle: string }
  : T extends BoardSocketEvent.createColumnSuccess
  ? { column: ColumnDto }
  : never;
