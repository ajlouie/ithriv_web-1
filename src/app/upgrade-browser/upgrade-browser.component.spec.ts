import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../home/home.component';
import { LogoComponent } from '../logo/logo.component';
import { UpgradeBrowserComponent } from './upgrade-browser.component';

describe('UpgradeBrowserComponent', () => {
  let component: UpgradeBrowserComponent;
  let fixture: ComponentFixture<UpgradeBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogoComponent,
        UpgradeBrowserComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: 'home', pathMatch: 'full' },
        ])
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
