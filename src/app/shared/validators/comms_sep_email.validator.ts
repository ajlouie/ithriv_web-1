import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';

export function ValidateEmail(control: AbstractControl): ValidationErrors {
    let value = control.value;
    if (value === null) {
        value = '';
    }
    const emails = value.split(',').map(e => e.trim());
    const forbidden = emails.some(email => Validators.email(new FormControl(email)));

    let notindomain = true;
    for (const email of emails) {
        if (email.indexOf('@virginia.edu') >= 0
            || email.indexOf('@vt.edu') >= 0
            || email.indexOf('@carilionclinic.org') >= 0
            || email.indexOf('@inova.org') >= 0) {
            notindomain = false;
            break;
        }
    }
    // console.log(notindomain);
    return forbidden || notindomain ? { 'toAddress': { value: control.value } } : null;
}

export function ValidateEmailSingle(control: AbstractControl): ValidationErrors {
    let value = control.value;
    if (value === null) {
        value = '';
    }

    const forbidden = Validators.email(new FormControl(value));

    let notindomain = true;
    if (value.indexOf('@virginia.edu') >= 0
        || value.indexOf('@vt.edu') >= 0
        || value.indexOf('@carilionclinic.org') >= 0
        || value.indexOf('@inova.org') >= 0) {
        notindomain = false;
    }
    // console.log(notindomain);
    return forbidden || notindomain ? { 'toAddress': { value: control.value } } : null;
}