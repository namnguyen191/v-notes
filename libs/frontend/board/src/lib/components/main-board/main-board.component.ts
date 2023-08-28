import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'lib-main-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainBoardComponent implements OnInit {
  private _boardService = inject(BoardService);

  ngOnInit(): void {
    this._boardService.fetchCurrentUserBoards().subscribe((boards) => {
      console.log('Nam data is: ', boards);
    });
  }
}
