import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

export const isControlInvalid = (control: FormControl) => {
  return control.touched && control.invalid;
};

export const matchValues = (matchTo: AbstractControl): ValidatorFn => {
  return (control: AbstractControl) => {
    return control.value === matchTo.value ? null : { isMatching: true };
  };
};
