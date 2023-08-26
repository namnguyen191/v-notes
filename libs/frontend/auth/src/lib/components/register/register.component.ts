import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { isControlInvalid, matchValues } from '@v-notes/shared/helpers';
import {
  ButtonModule,
  InputModule,
  LinkModule,
} from 'carbon-components-angular';
import { authRoutes } from '../../lib.routes';
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
  private _authService: AuthService = inject(AuthService);

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
        next: (accessToken) => this._authService.setToken(accessToken),
        error: (err) => {
          console.log('Something went wrong signing up user: ', err);
        },
      });
  }
}
