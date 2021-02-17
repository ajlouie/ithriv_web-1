import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ValidateEmailSingle } from '../shared/validators/comms_sep_email.validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IrbInvestigator, UserPermissionMap } from '../commons-types';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss'],
})
export class AddPermissionComponent implements OnInit {
  emailControl = new FormControl('', [Validators.required, ValidateEmailSingle]);
  irbInvestigators: IrbInvestigator[];
  permissionControl = new FormControl('', Validators.required);
  hasIrbNumber: boolean;
  isDataset: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddPermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserPermissionMap,
  ) {
  }

  ngOnInit() {
    this.emailControl.setValue(this.data.userPermission.user_email);
    this.permissionControl.setValue(this.data.userPermission.user_role);
    this.isDataset = this.data.isDataset || false;

    if (this.isDataset) {
      this.irbInvestigators = this.data.irbInvestigators;
      this.hasIrbNumber = this.data.hasIrbNumber;
    }
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
