import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function IdenticalValidator(fieldsToCompare: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    if (control.value !== undefined && control.value !== '') {
      const f1 = control.get(fieldsToCompare[0]);
      const f2 = control.get(fieldsToCompare[1]);
      if (f1.value !== '' && f1.value !== f2.value) {
        f2.setErrors({notSame: true});
      }
    }
    return null;
  };
}
