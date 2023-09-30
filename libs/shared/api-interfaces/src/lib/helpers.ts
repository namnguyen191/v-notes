import { Socket } from 'socket.io';
import { BoardSocketEvent, BoardSocketEventPayload } from './board-socket-api';

export const TypedEmit = (server: Socket) => {
  return <TEvent extends BoardSocketEvent>(
    to: string,
    eventName: TEvent,
    ...args: BoardSocketEventPayload<TEvent> extends never
      ? []
      : [eventPayload: BoardSocketEventPayload<TEvent>]
  ): void => {
    console.log('Nam data is: emit to', to);
    console.log('Nam data is: args', args);
    server.to(to).emit(eventName, ...args);
  };
};
