import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { AddResourceButtonComponent } from './add-resource-button.component';

describe('AddResourceButtonComponent', () => {
  let component: AddResourceButtonComponent;
  let fixture: ComponentFixture<AddResourceButtonComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [AddResourceButtonComponent],
        imports: [
          MatDialogModule,
          MatIconModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          ResourceApiService
        ],
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddResourceButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
