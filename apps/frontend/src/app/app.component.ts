import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@v-notes/frontend/auth';
import { HeaderModule, ThemeModule } from 'carbon-components-angular';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderModule, ThemeModule],
  selector: 'v-notes-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this._authService.fetchCurrentUser().subscribe({
      next: (usr) => {
        console.log('Nam data is: ', usr);
        this._authService.setCurrentUser(usr);
      },
      error: () => {
        console.log('Invalid token');
      },
    });
  }
}
