import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function childRequiredChildsValidator(parent: string, brotherList: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    if (control.parent) {
      const p = control.parent.get(parent);
      if (p.value === true && (control.value === '' || control.value === false)) {
        let isValid = false;
        p.setErrors({requiredOne: true});
        brotherList.forEach( required => {
          if (control.parent.get(required).value === true) {
            isValid = true;
          }
        });
        p.setErrors(isValid ? null : {requiredOne: true});
      }
      p.updateValueAndValidity();
    }
    return null;
  };
}
