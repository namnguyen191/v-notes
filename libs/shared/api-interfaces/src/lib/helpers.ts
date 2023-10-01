import { Socket } from 'socket.io';
import { BoardSocketEvent, BoardSocketEventPayload } from './board-socket-api';

export const TypedEmit = (server: Socket) => {
  return <TEvent extends BoardSocketEvent>(
    to: string | 'all',
    eventName: TEvent,
    ...args: BoardSocketEventPayload<TEvent> extends never
      ? []
      : [eventPayload: BoardSocketEventPayload<TEvent>]
  ): void => {
    if (to === 'all') {
      server.emit(eventName, ...args);
    } else {
      server.to(to).emit(eventName, ...args);
    }
  };
};
