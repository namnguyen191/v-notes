import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const simpleFadeInAndOut = (duration: string) => {
  return trigger('enterAnimation', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(`${duration} ease-out`, style({ opacity: 1 }))
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate(`${duration} ease-out`, style({ opacity: 0 }))
    ]),
    state('void', style({ display: 'none' }))
  ]);
};
