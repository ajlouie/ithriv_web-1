import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryColorBorderDirective } from '../category-color-border.directive';
import { CommonsProjectTileComponent } from './commons-project-tile.component';

describe('CommonsProjectTileComponent', () => {
  let component: CommonsProjectTileComponent;
  let fixture: ComponentFixture<CommonsProjectTileComponent>;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryColorBorderDirective,
        CommonsProjectTileComponent,
      ],
      imports: [
        MarkdownModule,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: Router, useValue: mockRouter},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsProjectTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
