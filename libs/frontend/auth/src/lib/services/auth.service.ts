import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { userTokenKey } from '@v-notes/frontend/shared';
import {
  AccessToken,
  GetCurrentuserResponse,
  SignInRequestBody,
  SignInResponse,
  SignUpRequestBody,
  SignUpResponse,
  UserFromJwt,
} from '@v-notes/shared/api-interfaces';
import { ENV_VARIABLES } from '@v-notes/shared/helpers';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';

type CurrentUser = UserFromJwt;

const env: ENV_VARIABLES = process.env as ENV_VARIABLES;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _http: HttpClient = inject(HttpClient);

  private _currentUserSubject$: BehaviorSubject<
    CurrentUser | null | undefined
  > = new BehaviorSubject<CurrentUser | null | undefined>(undefined);

  currentUser$ = this._currentUserSubject$.asObservable().pipe(
    switchMap((curUsr) => {
      const token: string | null = localStorage.getItem(userTokenKey);
      if (curUsr === undefined && token) {
        return this.fetchCurrentUser();
      }

      return of(null);
    })
  );
  isLoggedIn$ = this.currentUser$.pipe(map((currentUser) => !!currentUser));

  fetchCurrentUser(): Observable<CurrentUser> {
    return this._http.get<GetCurrentuserResponse>(
      `${env.NX_API_URL}/users/whoami`
    );
  }

  signUpUser(userInfos: SignUpRequestBody): Observable<AccessToken> {
    return this._http
      .post<SignUpResponse>(`${env.NX_API_URL}/auth/signup`, userInfos)
      .pipe(map((res) => res.access_token));
  }

  signInUser(userCredentials: SignInRequestBody): Observable<AccessToken> {
    return this._http
      .post<SignInResponse>(`${env.NX_API_URL}/auth/signin`, userCredentials)
      .pipe(map((res) => res.access_token));
  }

  setToken(token: AccessToken): void {
    localStorage.setItem(userTokenKey, token);
  }

  setCurrentUser(user: CurrentUser | null): void {
    this._currentUserSubject$.next(user);
  }
}
