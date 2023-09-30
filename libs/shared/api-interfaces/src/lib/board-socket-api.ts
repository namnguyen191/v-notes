import { ColumnDto, TaskDto } from './board-api';

export enum BoardSocketEvent {
  joinBoard = 'joinBoard',
  leaveBoard = 'leaveBoard',
  createColumn = 'createColumn',
  createColumnSuccess = 'createColumnSuccess',
  createColumnFailure = 'createColumnFailure',
  updateColumn = 'updateColumn',
  updateColumnSuccess = 'updateColumnSuccess',
  updateColumnFailure = 'updateColumnFailure',
  createTask = 'createTask',
  createTaskSuccess = 'createTaskSuccess',
  createTaskFailure = 'createTaskFailure'
}

export type BoardSocketEventPayload<T extends BoardSocketEvent> = T extends
  | BoardSocketEvent.joinBoard
  | BoardSocketEvent.leaveBoard
  ? {
      boardId: string;
    }
  : T extends BoardSocketEvent.createColumn
  ? { boardId: string; columnTitle: string }
  : T extends
      | BoardSocketEvent.createColumnSuccess
      | BoardSocketEvent.updateColumnSuccess
  ? { column: ColumnDto }
  : T extends BoardSocketEvent.updateColumn
  ? { boardId: string; columnId: string; columnTitle: string }
  : T extends BoardSocketEvent.createTask
  ? { title: string; columnId: string; boardId: string }
  : T extends BoardSocketEvent.createTaskSuccess
  ? { task: TaskDto }
  : never;
