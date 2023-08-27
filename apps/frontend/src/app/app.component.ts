import { Component, inject } from '@angular/core';
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
export class AppComponent {
  private _authService: AuthService = inject(AuthService);
}
