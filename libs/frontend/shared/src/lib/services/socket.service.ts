import { Injectable } from '@angular/core';
import {
  AccessToken,
  BoardSocketEvent,
  BoardSocketEventPayload
} from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

@Injectable({ providedIn: 'root' })
export class SocketService {
  private _socket: Socket | undefined;

  setupSocketConnection(token: AccessToken): void {
    this._socket = io(env.NX_API_SOCKET_URL, {
      auth: {
        token
      }
    });
  }

  disconnect(): void {
    if (!this._socket) {
      throw new Error('Socket connection is not established');
    }

    this._socket.disconnect();
  }

  emit<T extends BoardSocketEvent>(
    eventName: T,
    payload: BoardSocketEventPayload<T>
  ): void {
    if (!this._socket) {
      throw new Error('Socket connection is not established');
    }
    this._socket.emit(eventName, payload);
  }

  listen<T extends BoardSocketEvent>(
    eventName: T
  ): Observable<BoardSocketEventPayload<T>> {
    const socket = this._socket;
    if (!socket) {
      throw new Error('Socket connection is not established');
    }

    return new Observable((sub) => {
      socket.on(eventName as string, (data) => sub.next(data));
    });
  }
}
