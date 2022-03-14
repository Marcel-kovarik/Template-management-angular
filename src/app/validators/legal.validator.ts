import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function legalValidator(field: string, reference: string, requiredList: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    if (control) {
      const f = control.get(field);
      const ref = control.get(reference);
      if (ref.value === true) {
        let isValid = false;
        requiredList.forEach( required => {
          if (control.get(required).value === true) {
            isValid = true;
          }
        });
        f.setErrors(isValid ? null : {requiredOne: true});
      }
    }
    return null;
  };
}
