import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatProgressBarModule } from '@angular/material';

import { CommonsFileUploadComponent } from './commons-file-upload.component';

describe('CommonsFileUploadComponent', () => {
  let component: CommonsFileUploadComponent;
  let fixture: ComponentFixture<CommonsFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsFileUploadComponent ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatProgressBarModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
