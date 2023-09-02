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
import { BoardService } from '../../services/board.service';
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
  private _boardService = inject(BoardService);

  sideNavTheme: ThemeType = 'g10';
  boardRoutes = boardRoutes;
  currentUserBoards$ = this._boardService.currentUserBoards$;

  ngOnInit(): void {
    this._boardService.fetchCurrentUserBoards().subscribe((boards) => {
      this._boardService.setCurrentUserBoards(boards);
    });
  }

  onBoardTitleAdded(boardTitle: string): void {
    this._boardService.createBoard(boardTitle).subscribe({
      next: () => {
        this._boardService.addToCurrentUserBoards({ title: boardTitle });
      },
      error: (err) => {
        // TODO: handle error
        console.log('Error creating board', err);
      },
    });
  }
}
