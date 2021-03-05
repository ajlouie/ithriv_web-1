import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonsState, CommonsStateForm, Dataset, NavItem, Project } from '../commons-types';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { User } from '../user';

@Component({
  selector: 'app-commons-home',
  templateUrl: './commons-home.component.html',
  styleUrls: ['./commons-home.component.scss'],
})
export class CommonsHomeComponent implements OnInit {
  @Input() user: User;
  @Input() formStatus: CommonsStateForm;
  @Input() tabIndex: number;
  @Output() formStatusChange = new EventEmitter<string>();
  projectCreateEditPrevForm: CommonsStateForm = 'commons-projects-list';
  datasetCreateEditPrevForm: CommonsStateForm = 'commons-project';
  currentProject: Project;
  currentDataset: Dataset;
  projectDataPrivate$: Observable<Project[]> | undefined;
  projectDataPublic$: Observable<Project[]> | undefined;
  datasetDataPrivate$: Observable<Dataset[]> | undefined;
  datasetDataPublic$: Observable<Dataset[]> | undefined;
  navItems: NavItem[] = [];
  private statusNavItems: { [key in CommonsStateForm]: NavItem };
  projectAction: string;

  constructor(private cas: CommonsApiService) {
  }

  get commonsHomeToolbarTitle(): string {
    switch (this.formStatus) {
      case 'commons-project':
        return `Project${this.currentProject ? ': ' + this.currentProject.name : ''}`;
      case 'commons-project-create-edit':
        return 'Edit Project Details/Permissions';
      case 'commons-dataset':
        return `Dataset${this.currentDataset ? ': ' + this.currentDataset.name : ''}`;
      case 'commons-dataset-create-edit':
        return 'Edit Dataset Details/Permissions';
      default:
        return '';
    }
  }

  ngOnInit() {
    this.projectDataPrivate$ = this.cas.loadPrivateProjects();
    this.projectDataPublic$ = this.cas.loadPublicProjects();

    this.statusNavItems = {
      'commons-projects-list': {
        title: 'Commons Home',
        routerLink: '/home',
        queryParams: {tabIndex: this.tabIndex},
        onClick: () => this.updateStatus({displayForm: 'commons-projects-list'})
      },
      'commons-project': {
        title: 'Project Home',
        onClick: () => this.updateStatus({displayForm: 'commons-project'})
      },
      'commons-project-create-edit': {
        title: 'Edit Project',
        onClick: () => this.updateStatus({displayForm: 'commons-project-create-edit'})
      },
      'commons-dataset': {
        title: 'View Dataset',
        onClick: () => this.updateStatus({displayForm: 'commons-dataset'})
      },
      'commons-dataset-create-edit': {
        title: 'Edit Dataset',
        onClick: () => this.updateStatus({displayForm: 'commons-dataset-create-edit'})
      },
    };

    this.navItems = [this.statusNavItems['commons-projects-list']];
  }

  updateStatus(event: CommonsState) {
    this.formStatus = event.displayForm;
    if (event.currentProject !== undefined) {
      this.currentProject = event.currentProject;
    }

    if (this.currentProject !== undefined) {
      this.datasetDataPrivate$ = this.cas.loadPrivateDatasets(
        this.currentProject.id
      );
      this.datasetDataPublic$ = this.cas.loadPublicDatasets(
        this.currentProject.id
      );
    }
    if (event.currentDataset !== undefined) {
      this.currentDataset = event.currentDataset;
    }
    if (event.previousForm !== undefined) {
      this.projectCreateEditPrevForm = event.previousForm;
      this.datasetCreateEditPrevForm = event.previousForm;
    } else {
      this.projectCreateEditPrevForm = 'commons-projects-list';
      this.datasetCreateEditPrevForm = 'commons-project';
    }

    // Update breadcrumbs items
    if (this.formStatus === 'commons-dataset-create-edit') {
      if (
        this.currentDataset === undefined ||
        this.currentDataset.id === undefined ||
        this.currentDataset.id === ''
      ) {
        // New dataset. Leave out the "View Dataset" item.
        // Home > Commons Home > Project Home > Edit Dataset
        this.navItems = [
          this.statusNavItems['commons-projects-list'],
          this.statusNavItems['commons-project'],
          this.statusNavItems['commons-dataset-create-edit'],
        ];
      } else {
        // Home > Commons Home > Project Home > View Dataset > Edit Dataset
        this.navItems = [
          this.statusNavItems['commons-projects-list'],
          this.statusNavItems['commons-project'],
          this.statusNavItems['commons-dataset'],
          this.statusNavItems['commons-dataset-create-edit'],
        ];
      }

    } else if (this.formStatus === 'commons-dataset') {
      // Home > Commons Home > Project Home > View Dataset
      this.navItems = [
        this.statusNavItems['commons-projects-list'],
        this.statusNavItems['commons-project'],
        this.statusNavItems['commons-dataset'],
      ];
    } else if (this.formStatus === 'commons-project-create-edit') {
      if (
        this.currentProject === undefined ||
        this.currentProject.id === undefined ||
        this.currentProject.id === ''
      ) {
        // New project. Leave out the "View Project" item.
        // Home > Commons Home > Edit Project
        this.navItems = [
          this.statusNavItems['commons-projects-list'],
          this.statusNavItems['commons-project-create-edit'],
        ];
      } else {
        // Home > Commons Home > Project Home > Edit Project
        this.navItems = [
          this.statusNavItems['commons-projects-list'],
          this.statusNavItems['commons-project'],
          this.statusNavItems['commons-project-create-edit'],
        ];
      }
    } else if (this.formStatus === 'commons-project') {
      // Home > Commons Home > Project Home
      this.navItems = [
        this.statusNavItems['commons-projects-list'],
        this.statusNavItems['commons-project'],
      ];
    } else {
      // Home > Commons Home
      this.navItems = [
        this.statusNavItems['commons-projects-list'],
      ];
    }

    this.formStatusChange.emit(this.formStatus);
  }

  handleProjectDelete($event: boolean) {
    // Inform the commons-project.component that the project has been deleted.
  }
}
