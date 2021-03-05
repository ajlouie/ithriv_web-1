import {Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Dataset } from '../commons-types';

export interface HsdDownloadDialogData {
  confirm: boolean;
  dataset: Dataset;
}

@Component({
  selector: 'app-hsd-download-dialog',
  templateUrl: './hsd-download-dialog.component.html',
  styleUrls: ['./hsd-download-dialog.component.scss']
})
export class HsdDownloadDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HsdDownloadDialogData,
    public dialogRef: MatDialogRef<HsdDownloadDialogComponent>
  ) { }

  ngOnInit() {
  }

  onNoClick() {
    this.data.confirm = false;
    this.dialogRef.close(this.data);
  }

  onSubmit() {
    this.data.confirm = true;
    this.dialogRef.close(this.data);
  }
}
