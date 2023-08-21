import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  GetCurrentuserResponse,
  UserFromJwt,
} from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { BehaviorSubject, Observable } from 'rxjs';

type CurrentUser = UserFromJwt;

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _http: HttpClient = inject(HttpClient);

  private _currentUserSubject$: BehaviorSubject<
    CurrentUser | null | undefined
  > = new BehaviorSubject<CurrentUser | null | undefined>(undefined);

  currentUser$ = this._currentUserSubject$.asObservable();

  fetchCurrentUser(): Observable<CurrentUser> {
    return this._http.get<GetCurrentuserResponse>(
      `${env.NX_API_URL}/users/whoami`
    );
  }

  setCurrentUser(user: CurrentUser | null): void {
    this._currentUserSubject$.next(user);
  }
}
