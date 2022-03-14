import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function requiredIfValidator(requiredList: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    if (control.value !== undefined && typeof control.value === 'boolean') {
      requiredList.forEach( required => {
        const field = control.parent.get(required);
        field.clearValidators();
        if (control.value === true) {
          field.setValidators(Validators.required);
        }
        field.updateValueAndValidity();
      });
    }
    return null;
  };
}
