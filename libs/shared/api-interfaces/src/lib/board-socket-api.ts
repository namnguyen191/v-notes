export enum BoardSocketEvent {
  joinBoard = 'joinBoard',
  leaveBoard = 'leaveBoard'
}

export type BoardSocketEventPayload<T extends BoardSocketEvent> = T extends
  | BoardSocketEvent.joinBoard
  | BoardSocketEvent.leaveBoard
  ? {
      boardId: string;
    }
  : never;
