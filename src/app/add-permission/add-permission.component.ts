import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserPermissionMap } from '../commons-types';
import { FormControl, Validators } from '@angular/forms';
import { ValidateEmailSingle } from '../shared/validators/comms_sep_email.validator';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss'],
})
export class AddPermissionComponent implements OnInit {
  emailControl = new FormControl('', [Validators.required, ValidateEmailSingle]);
  permissionControl = new FormControl('', Validators.required);
  constructor(
    public dialogRef: MatDialogRef<AddPermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserPermissionMap
  ) {}

  ngOnInit() {
    this.emailControl.setValue(this.data.userPermission.user_email);
    this.permissionControl.setValue(this.data.userPermission.user_role);
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  validate() {
    this.emailControl.markAsTouched();
    this.emailControl.updateValueAndValidity();
    this.permissionControl.markAsTouched();
    this.permissionControl.updateValueAndValidity();

    return !(this.emailControl.errors || this.permissionControl.errors);
  }

  submit(): void {
    if (this.validate()) {
      this.dialogRef.close(this.data.userPermission);
    }
  }
}
