import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsProjectTileComponent } from './commons-project-tile.component';

describe('CommonsProjectTileComponent', () => {
  let component: CommonsProjectTileComponent;
  let fixture: ComponentFixture<CommonsProjectTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsProjectTileComponent ]
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
