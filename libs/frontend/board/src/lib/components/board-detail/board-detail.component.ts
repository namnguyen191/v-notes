import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'lib-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardDetailComponent implements OnInit {
  private readonly _boardService: BoardService = inject(BoardService);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);

  currentBoard$ = this._boardService.currentBoard$;

  ngOnInit(): void {
    const boardTitle = this._route.snapshot.paramMap.get('title');

    if (!boardTitle) {
      console.error('Missing board title in url parameter');
      return;
    }

    this._boardService.fetchBoardByTitle(boardTitle).subscribe({
      next: (board) => this._boardService.setCurrentBoard(board),
    });
  }
}
