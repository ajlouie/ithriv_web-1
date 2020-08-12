import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ProjectDocumentMap } from '../commons-types';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';

@Component({
  selector: 'app-commons-project-document',
  templateUrl: './commons-project-document.component.html',
  styleUrls: ['./commons-project-document.component.scss'],
})
export class CommonsProjectDocumentComponent implements OnInit {
  projectDocumentTypes = [
    'Protocol',
    'Contract',
    'IRB Application',
    'IRB Approval',
    'Data Security Plan',
    'Publication',
    'Other',
  ];
  documentTypeControl = new FormControl('', Validators.required);
  constructor(
    public dialogRef: MatDialogRef<CommonsProjectDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public projectDocumentMap: ProjectDocumentMap,
    private cas: CommonsApiService
  ) {}

  ngOnInit() {
    this.documentTypeControl.setValue(this.projectDocumentMap.document.type);
    this.validate();
  }

  onFileComplete(data: any) {
    this.dialogRef.close(null);
  }

  uploadUrlDocument() {
    return (
      this.cas.getLandingServiceUrl(this.projectDocumentMap.user) +
      `/commons/meta/projects/file/${this.projectDocumentMap.project.id}/${this.documentTypeControl.value}`
    );
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  validate() {
    this.documentTypeControl.markAsTouched();
    this.documentTypeControl.updateValueAndValidity();

    return !this.documentTypeControl.errors;
  }

  submit(): void {
    if (this.validate()) {
      this.dialogRef.close(null);
    }
  }
}
