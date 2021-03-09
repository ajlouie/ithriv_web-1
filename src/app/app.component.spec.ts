import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatDividerModule,
  MatIconModule,
  MatToolbarModule
} from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppComponent } from './app.component';
import { Icon } from './icon';
import { TimeLeftPipe } from './shared/filters/time-left.pipe';
import { ResourceApiService } from './shared/resource-api/resource-api.service';

describe('AppComponent', () => {
  let httpMock: HttpTestingController;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockIcons: Icon[] = [
    {id: 0, name: 'jabba_the_hutt', url: 'some.website.com/icons/jabba'},
    {id: 1, name: 'boba_fett', url: 'some.website.com/icons/boba'},
    {id: 2, name: 'max_rebo', url: 'some.website.com/icons/max'},
  ];

  beforeEach(async(() => {
    window['ga'] = function () {
    };

    TestBed
      .configureTestingModule({
        declarations: [
          AppComponent,
          TimeLeftPipe,
        ],
        imports: [
          HttpClientTestingModule,
          NoopAnimationsModule,
          MatButtonModule,
          MatIconModule,
          MatDividerModule,
          MatToolbarModule,
          MatButtonToggleModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          ResourceApiService,
          DeviceDetectorService,
          {
            provide: HAMMER_LOADER, useValue: () => new Promise(() => {
            })
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne(`http://localhost:5000/api/icon`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockIcons);
  });

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();

    sessionStorage.clear();
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'iTHRIV'`, () => {
    expect(component.title).toEqual('iTHRIV');
  });

  it('should load icons', () => {
    expect(component.icons).toEqual(mockIcons);
  });
});
