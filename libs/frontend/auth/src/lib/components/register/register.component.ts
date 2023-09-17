import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SocketService, authRoutes } from '@v-notes/frontend/shared';
import { isControlInvalid, matchValues } from '@v-notes/shared/helpers';
import {
  ButtonModule,
  InputModule,
  LinkModule,
} from 'carbon-components-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'v-notes-register',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputModule,
    ReactiveFormsModule,
    RouterModule,
    LinkModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);
  private readonly _socketService: SocketService = inject(SocketService);

  isControlInvalid = isControlInvalid;
  authRoutes = authRoutes;

  registrationForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    confirmedPassword: FormControl<string>;
  }>;

  constructor() {
    this._initializeForm();
  }

  private _initializeForm(): void {
    const passwordFormControl = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    });
    this.registrationForm = new FormGroup({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: passwordFormControl,
      confirmedPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, matchValues(passwordFormControl)],
      }),
    });

    this.registrationForm.controls.password.valueChanges.subscribe(() =>
      this.registrationForm.controls.confirmedPassword.updateValueAndValidity()
    );
  }

  onRegistrationFormSubmit(): void {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.invalid) {
      return;
    }

    this._authService
      .signUpUser({
        email: this.registrationForm.controls.email.value,
        password: this.registrationForm.controls.password.value,
      })
      .subscribe({
        next: (accessToken) => {
          this._authService.setToken(accessToken);
          this._socketService.setupSocketConnection(accessToken);
          this._authService.fetchCurrentUser().subscribe((usr) => {
            this._authService.setCurrentUser(usr);
            this._router.navigateByUrl(`/board`);
          });
        },
        error: (err) => {
          console.log('Something went wrong signing up user: ', err);
        },
      });
  }
}
