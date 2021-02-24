import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';

const allowedDomains = [
  'virginia.edu',
  'vt.edu',
  'carilionclinic.org',
  'inova.org',
];

const pattern = new RegExp(`^([a-z0-9]+)@(${allowedDomains.join('|')})$`, 'i');

const isForbidden = (email: string): boolean => {
  const isNotEmailAddress = Validators.email(new FormControl(email));
  const isNotAllowedDomain = !pattern.test(email);
  return !!(isNotEmailAddress || isNotAllowedDomain);
};

export function ValidateEmail(control: AbstractControl): ValidationErrors {
  let value = control.value;
  if (value === null) {
    value = '';
  }
  const emails = value.split(',').map(e => e.trim());
  const forbidden = emails.some(isForbidden);
  return forbidden ? {'email': {value: control.value}} : null;
}

export function ValidateEmailSingle(control: AbstractControl): ValidationErrors {
  let value = control.value;
  if (value === null) {
    value = '';
  }

  return isForbidden(value) ? {'email': {value: control.value}} : null;
}
