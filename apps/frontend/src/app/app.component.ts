import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderModule, ThemeModule } from 'carbon-components-angular';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderModule, ThemeModule],
  selector: 'v-notes-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
}
