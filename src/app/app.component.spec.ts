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
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs/internal/observable/of';
import { AppComponent } from './app.component';
import { TimeLeftPipe } from './shared/filters/time-left.pipe';
import { MockResourceApiService } from './shared/mocks/resource-api.service.mock';
import { ResourceApiService } from './shared/resource-api/resource-api.service';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Icon } from './icon';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let api: MockResourceApiService;
  let icons: Icon[];

  beforeEach(async(() => {
    window['ga'] = function () {};
    api = new MockResourceApiService();

    TestBed
      .configureTestingModule({
        declarations: [
          AppComponent,
          TimeLeftPipe,
        ],
        imports: [
          NoopAnimationsModule,
          MatButtonModule,
          MatIconModule,
          MatDividerModule,
          MatToolbarModule,
          MatButtonToggleModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          { provide: ResourceApiService, useValue: api },
          DeviceDetectorService,
          { provide: HAMMER_LOADER, useValue: () => new Promise(() => {}) },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    icons = [
      { id: 0, name: 'jabba_the_hutt', url: 'some.website.com/icons/jabba' },
      { id: 1, name: 'boba_fett', url: 'some.website.com/icons/boba' },
      { id: 2, name: 'max_rebo', url: 'some.website.com/icons/max' },
    ];

    api.spyAndReturnFake('getIcons', icons);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'iTHRIV'`, () => {
    expect(component.title).toEqual('iTHRIV');
  });

  it('should load icons', () => {
    expect(component.icons).toEqual(icons);
  });
});
