import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { boardRoutes } from '@v-notes/frontend/shared';
import {
  SideNavModule,
  ThemeModule,
  ThemeType,
} from 'carbon-components-angular';

@Component({
  selector: 'lib-board',
  standalone: true,
  imports: [CommonModule, SideNavModule, ThemeModule, RouterModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  sideNavTheme: ThemeType = 'g10';
  boardRoutes = boardRoutes;
}
