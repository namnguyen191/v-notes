import { CommonModule } from '@angular/common';
import {
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  inject,
  signal
} from '@angular/core';

import {
  ChangeDetectionStrategy,
  Component,
  HostListener
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { simpleFadeInAndOut } from '@v-notes/frontend/shared';
import { isControlInvalid } from '@v-notes/shared/helpers';
import { InputModule } from 'carbon-components-angular';

@Component({
  selector: 'v-notes-lib-inline-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputModule],
  templateUrl: './inline-form.component.html',
  styleUrls: ['./inline-form.component.scss'],
  animations: [simpleFadeInAndOut('250ms')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineFormComponent implements OnInit {
  private _renderer2: Renderer2 = inject(Renderer2);
  private _elementRef: ElementRef = inject(ElementRef);

  isControlInvalid = isControlInvalid;
  boardForm!: FormGroup<{
    title: FormControl<string>;
  }>;
  isEditMode = signal<boolean>(false);

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    this.isEditMode.set(true);
    // detect if click is outside of this element
    e.stopPropagation();
  }

  private _boardTitleInput?: ElementRef<HTMLInputElement>;
  @ViewChild('boardTitleInput')
  set boardTitleInput(
    boardTitleInputElementRef: ElementRef<HTMLInputElement> | undefined
  ) {
    this._boardTitleInput = boardTitleInputElementRef;
    if (!boardTitleInputElementRef) {
      return;
    }
    boardTitleInputElementRef.nativeElement.focus();
  }

  @Input()
  formTitle = '';

  @Output()
  valueSubmitted = new EventEmitter<string>();

  constructor() {
    this._initializeForm();
  }

  ngOnInit(): void {
    this._renderer2.listen('window', 'click', (e: Event) => {
      if (e.target !== this._elementRef.nativeElement) {
        this.isEditMode.set(false);
      }
    });
  }

  private _initializeForm(): void {
    this.boardForm = new FormGroup({
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    this.boardForm.markAllAsTouched();
    if (this.boardForm.invalid) {
      return;
    }

    this.isEditMode.set(false);

    this.valueSubmitted.emit(this.boardForm.controls.title.value);

    this.boardForm.reset();
  }
}
