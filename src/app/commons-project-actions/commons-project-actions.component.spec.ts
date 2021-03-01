import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { mockProject } from '../shared/fixtures/project';
import { CommonsProjectActionsComponent } from './commons-project-actions.component';
import { cloneDeep } from 'lodash';

describe('CommonsProjectActionsComponent', () => {
  let component: CommonsProjectActionsComponent;
  let fixture: ComponentFixture<CommonsProjectActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommonsProjectActionsComponent
      ],
      imports: [
        MatIconModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsProjectActionsComponent);
    component = fixture.componentInstance;
    component.project = mockProject,
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit', () => {
    spyOn(component.deleteClicked, 'emit');
    const projectWithPermissions = cloneDeep(mockProject);
    projectWithPermissions.can_delete_data = true;
    projectWithPermissions.can_delete_meta = true;
    component.project = projectWithPermissions;
    fixture.detectChanges();

    expect(component.showConfirmDelete).toBeFalsy();
    const showConfirmDelete = fixture.debugElement.query(By.css('.show-confirm-delete'));
    expect(showConfirmDelete).toBeTruthy();
    showConfirmDelete.triggerEventHandler('click', {});

    fixture.detectChanges();
    expect(component.showConfirmDelete).toBeTruthy();

    const confirmDelete = fixture.debugElement.query(By.css('.confirm-delete'));
    expect(confirmDelete).toBeTruthy();
    confirmDelete.triggerEventHandler('click', {});

    expect(component.deleteClicked.emit).toHaveBeenCalled();
  });
});
