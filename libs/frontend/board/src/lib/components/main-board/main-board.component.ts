import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  SocketService,
  boardRoutes,
  simpleFadeInAndOut
} from '@v-notes/frontend/shared';
import { BoardSocketEvent } from '@v-notes/shared/api-interfaces';
import {
  ButtonModule,
  IconModule,
  SideNavModule,
  ThemeModule,
  ThemeType
} from 'carbon-components-angular';
import { BoardsService } from '../../services/boards.service';
import { InlineFormComponent } from '../inline-form/inline-form.component';

@Component({
  selector: 'v-notes-lib-main-board',
  standalone: true,
  imports: [
    CommonModule,
    SideNavModule,
    ThemeModule,
    RouterModule,
    InlineFormComponent,
    ButtonModule,
    IconModule
  ],
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simpleFadeInAndOut('400ms')]
})
export class MainBoardComponent implements OnInit {
  private _boardsService = inject(BoardsService);
  private readonly _socketService: SocketService = inject(SocketService);

  sideNavTheme: ThemeType = 'g10';
  boardRoutes = boardRoutes;
  currentUserBoards$ = this._boardsService.currentUserBoards$;

  constructor() {
    this._initializedListener();
  }

  ngOnInit(): void {
    this._boardsService.fetchAllBoards().subscribe((boards) => {
      this._boardsService.setCurrentUserBoards(boards);
    });
  }

  onDeleteBoard(e: MouseEvent, id: string) {
    e.stopPropagation();
    e.preventDefault();
    this._boardsService.deleteBoard(id);
  }

  onBoardTitleAdded(boardTitle: string): void {
    this._boardsService.createBoard(boardTitle).subscribe({
      next: (newBoard) => {
        this._boardsService.addToCurrentUserBoards(newBoard);
      },
      error: (err) => {
        // TODO: handle error
        console.log('Error creating board', err);
      }
    });
  }

  private _initializedListener(): void {
    this._socketService
      .listen(BoardSocketEvent.deleteBoardSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ boardId }) => {
        this._boardsService.removeFromCurrentUserBoards(boardId);
      });
  }
}
