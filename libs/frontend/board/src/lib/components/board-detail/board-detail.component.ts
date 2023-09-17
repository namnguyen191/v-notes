import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { SocketService } from '@v-notes/frontend/shared';
import { BoardSocketEvent } from '@v-notes/shared/api-interfaces';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'lib-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardDetailComponent implements OnInit {
  private readonly _boardService: BoardService = inject(BoardService);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);
  private readonly _socketService: SocketService = inject(SocketService);

  currentBoard$ = this._boardService.currentBoard$;

  ngOnInit(): void {
    const boardId = this._route.snapshot.paramMap.get('id');

    if (!boardId) {
      console.error('Missing board title id url parameter');
      return;
    }

    this._boardService.fetchBoardById(boardId).subscribe({
      next: (board) => {
        this._boardService.setCurrentBoard(board);

        this._socketService.emit(BoardSocketEvent.joinBoard, { boardId });
      }
    });

    this._initializedListener();
  }

  private _initializedListener(): void {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this._boardService.leaveCurrentBoard();
      }
    });
  }
}
