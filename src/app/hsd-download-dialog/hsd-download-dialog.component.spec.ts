import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogRef, MatIconModule } from '@angular/material';
import { mockDataset } from '../shared/fixtures/dataset';

import { HsdDownloadDialogComponent } from './hsd-download-dialog.component';

describe('HsdDownloadDialogComponent', () => {
  let component: HsdDownloadDialogComponent;
  let fixture: ComponentFixture<HsdDownloadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HsdDownloadDialogComponent,
      ],
      imports: [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            confirm: false,
            dataset: mockDataset,
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsdDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
