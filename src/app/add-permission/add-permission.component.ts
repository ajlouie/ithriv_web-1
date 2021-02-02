import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IrbInvestigator, UserPermissionMap } from '../commons-types';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss'],
})
export class AddPermissionComponent implements OnInit {
  irbInvestigators: IrbInvestigator[];
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  permissionControl = new FormControl('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<AddPermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserPermissionMap,
  ) {
  }

  ngOnInit() {
    this.emailControl.setValue(this.data.userPermission.user_email);
    this.permissionControl.setValue(this.data.userPermission.user_role);
    this.irbInvestigators = this.data.irbInvestigators;
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
