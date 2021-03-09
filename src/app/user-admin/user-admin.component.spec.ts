import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockUser } from '../shared/fixtures/user';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { UserAdminComponent } from './user-admin.component';

describe('UserAdminComponent', () => {
  let httpMock: HttpTestingController;
  let component: UserAdminComponent;
  let fixture: ComponentFixture<UserAdminComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [UserAdminComponent],
        imports: [
          BrowserAnimationsModule,
          HttpClientTestingModule,
          MatPaginatorModule,
          MatSortModule,
          MatTableModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          ResourceApiService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(UserAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // const req = httpMock.expectOne(`http://localhost:5000/api/user`);
        // expect(req.request.method).toEqual('GET');
        // req.flush([mockUser]);
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
