import { FormControl } from '@angular/forms';
import { ValidateEmail, ValidateEmailSingle } from './comms_sep_email.validator';

describe('ValidateEmail', () => {
  const mockControl = new FormControl('');

  it('should return null for valid email address', () => {
    mockControl.setValue('good1@vt.edu,good2@virginia.edu');
    expect(ValidateEmail(mockControl)).toBeNull();

    mockControl.setValue(' good1@vt.edu ,  good2@virginia.edu    ');
    expect(ValidateEmail(mockControl)).toBeNull();
  });

  it('should return error for single email containing invalid email address', () => {
    const string1 = 'bad@email.com';
    mockControl.setValue(string1);
    expect(ValidateEmailSingle(mockControl)).toEqual({ email: { value: string1 } });

    const string2 = 'this_is_not_an_email!';
    mockControl.setValue(string2);
    expect(ValidateEmailSingle(mockControl)).toEqual({ email: { value: string2 } });
  });

  it('should return null for comma-delimited list of valid email addresses', () => {
    mockControl.setValue('good1@vt.edu,good2@virginia.edu');
    expect(ValidateEmail(mockControl)).toBeNull();

    mockControl.setValue(' good1@vt.edu ,  good2@virginia.edu    ');
    expect(ValidateEmail(mockControl)).toBeNull();
  });

  it('should return error for comma-delimited list containing disallowed email address', () => {
    const string1 = 'good1@vt.edu,bad@email.com,good2@virginia.edu';
    mockControl.setValue(string1);
    expect(ValidateEmail(mockControl)).toEqual({ email: { value: string1 } });

    const string2 = ' good1@vt.edu ,  bad@email.com      ,good2@virginia.edu';
    mockControl.setValue(string2);
    expect(ValidateEmail(mockControl)).toEqual({ email: { value: string2 } });

    const string3 = 'good1@vt.edu,this_is_not_an_email!,good2@virginia.edu';
    mockControl.setValue(string3);
    expect(ValidateEmail(mockControl)).toEqual({ email: { value: string3 } });
  });
});
