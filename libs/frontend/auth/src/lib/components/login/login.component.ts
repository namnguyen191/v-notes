import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  SocketService,
  authRoutes,
  boardRoutes,
} from '@v-notes/frontend/shared';
import { isControlInvalid } from '@v-notes/shared/helpers';
import {
  ButtonModule,
  InputModule,
  LinkModule,
} from 'carbon-components-angular';
import { take, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'v-notes-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    RouterModule,
    ButtonModule,
    LinkModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private _socketService: SocketService = inject(SocketService);

  isControlInvalid = isControlInvalid;
  authRoutes = authRoutes;

  loginForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor() {
    this._initializeForm();
  }

  ngOnInit(): void {
    this._authService.isLoggedIn$
      .pipe(
        take(1),
        tap((isLoggedIn) => {
          if (isLoggedIn) {
            this._router.navigateByUrl(boardRoutes.mainBoard);
          }
        })
      )
      .subscribe();
  }

  private _initializeForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  onLoginFormSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this._authService
      .signInUser({
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value,
      })
      .subscribe({
        next: (token) => {
          this._authService.setToken(token);
          this._socketService.setupSocketConnection(token);
          this._authService.fetchCurrentUser().subscribe((usr) => {
            this._authService.setCurrentUser(usr);
            this._router.navigateByUrl(`/board`);
          });
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === HttpStatusCode.Unauthorized) {
              console.log('Wrong credential');
            }
          }
        },
      });
  }
}
