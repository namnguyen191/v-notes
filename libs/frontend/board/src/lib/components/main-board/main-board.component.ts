import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { boardRoutes, simpleFadeInAndOut } from '@v-notes/frontend/shared';
import {
  SideNavModule,
  ThemeModule,
  ThemeType,
} from 'carbon-components-angular';
import { BoardsService } from '../../services/boards.service';
import { InlineFormComponent } from '../inline-form/inline-form.component';

@Component({
  selector: 'lib-main-board',
  standalone: true,
  imports: [
    CommonModule,
    SideNavModule,
    ThemeModule,
    RouterModule,
    InlineFormComponent,
  ],
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simpleFadeInAndOut('400ms')],
})
export class MainBoardComponent implements OnInit {
  private _boardsService = inject(BoardsService);

  sideNavTheme: ThemeType = 'g10';
  boardRoutes = boardRoutes;
  currentUserBoards$ = this._boardsService.currentUserBoards$;

  ngOnInit(): void {
    this._boardsService.fetchCurrentUserBoards().subscribe((boards) => {
      this._boardsService.setCurrentUserBoards(boards);
    });
  }

  onBoardTitleAdded(boardTitle: string): void {
    this._boardsService.createBoard(boardTitle).subscribe({
      next: () => {
        this._boardsService.addToCurrentUserBoards({ title: boardTitle });
      },
      error: (err) => {
        // TODO: handle error
        console.log('Error creating board', err);
      },
    });
  }
}
