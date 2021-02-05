import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';

export function ValidateEmail(control: AbstractControl): ValidationErrors {
    let value = control.value;
    if (value === null) {
        value = '';
    }
    const emails = value.split(',').map(e => e.trim());
    const forbidden = emails.some(email => Validators.email(new FormControl(email)));
    // console.log(forbidden);
    return forbidden ? { 'toAddress': { value: control.value } } : null;
}