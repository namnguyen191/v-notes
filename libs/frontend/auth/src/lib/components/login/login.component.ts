import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'v-notes-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this._authService.fetchCurrentUser().subscribe({
      next: (user) => {
        this._authService.setCurrentUser(user);
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          console.error(
            'Something went wrong fetching current user: ',
            err.message
          );
        } else {
          console.error('unknown error: ', err);
        }
        this._authService.setCurrentUser(null);
      },
    });
  }
}
