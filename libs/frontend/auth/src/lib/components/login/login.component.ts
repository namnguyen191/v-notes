import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { isControlInvalid } from '@v-notes/shared/helpers';
import {
  ButtonModule,
  InputModule,
  LinkModule,
} from 'carbon-components-angular';
import { authRoutes } from '../../lib.routes';
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
export class LoginComponent {
  private _authService: AuthService = inject(AuthService);

  isControlInvalid = isControlInvalid;
  authRoutes = authRoutes;

  loginForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor() {
    this._initializeForm();
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
          this._authService
            .fetchCurrentUser()
            .subscribe((usr) => this._authService.setCurrentUser(usr));
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
