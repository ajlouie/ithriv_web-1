import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockIrbInvestigators } from '../../testing/mocks/mock-investigators';
import { CommonsDatasetCreateEditComponent } from '../commons-dataset-create-edit/commons-dataset-create-edit.component';

import { AddPermissionComponent } from './add-permission.component';

describe('AddPermissionComponent', () => {
  let component: AddPermissionComponent;
  let fixture: ComponentFixture<AddPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPermissionComponent],
      imports: [
        FormsModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
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
            userPermission: {},
            permissionsMap: CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC,
            irbInvestigators: mockIrbInvestigators,
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list IRB investigators', () => {
    expect(component.irbInvestigators.length).toEqual(mockIrbInvestigators.length);
  });
});
