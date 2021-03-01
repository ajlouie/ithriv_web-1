import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
      ],
      imports: [
        MatIconModule,
        RouterTestingModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    component.navItems = [
      {
        title: 'Second link',
        routerLink: '/home',
        queryParams: {tabIndex: 3},
        onClick: () => {
          // Do something
        },
      },
      {
        title: 'Third link',
        onClick: () => {
          // Do something
        },
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const linkElements = fixture.debugElement.queryAll(By.css('.breadcrumbs a'));
    expect(linkElements.length).toEqual(component.navItems.length + 1);
  });
});
