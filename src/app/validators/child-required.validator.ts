import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function childRequiredValidator(childList: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    if (typeof control.value === 'boolean' && control.value === true) {
      let isValid = false;
      childList.forEach( required => {
        if (control.parent.get(required).value === true) {
          isValid = true;
        }
      });
      return isValid ? null : {requiredOne: true};
    }
    return null;
  };
}
