import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ValidateDateTimeRange(
  control: AbstractControl
): ValidationErrors {
  const regEx = new RegExp(
    '.* .* .* .... .*:.*:.* .*,.* .* .* .... .*:.*:.* .*',
    'g'
  );
  const regEx2 = new RegExp('.*-.*-.*:.*:.*,.*-.*-.*:.*:.*', 'g');

  console.log(control.value);
  if (
    control.value &&
    control.value !== '' &&
    !regEx.test(control.value) &&
    !regEx2.test(control.value)
  ) {
    const error: ValidationErrors = { dateTimeRange: true };
    return error;
  }
}