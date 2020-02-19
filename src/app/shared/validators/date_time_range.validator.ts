import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ValidateDateTimeRange(
  control: AbstractControl
): ValidationErrors {
  const regEx = new RegExp(
    '.* .* .* .... .*:.*:.* .*,.* .* .* .... .*:.*:.* .*',
    'g'
  );

  if (control.value && control.value !== '' && !regEx.test(control.value)) {
    // alert(control.value);
    const error: ValidationErrors = { dateTimeRange: true };
    return error;
  }
}
