import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of as observableOf } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {
  groupBy,
  mergeMap,
  catchError,
  last,
  map,
  tap,
  filter,
  toArray,
} from 'rxjs/operators';
import fileSaver from 'file-saver';
import { environment } from '../../../environments/environment';
import { mockIrbInvestigators } from '../fixtures/investigators';
import { FileAttachment } from '../../file-attachment';
import { User } from '../../user';
import {
  Project,
  UserPermission,
  DatasetFileVersion,
  IrbInvestigator, IrbInvestigatorType, IrbInvestigatorTypeLabel,
} from '../../commons-types';
import { Dataset } from '../../commons-types';
import { ProjectDocument } from '../../commons-types';
@Injectable({
  providedIn: 'root',
})
export class CommonsApiService {
  apiRoot = environment.api_commons_adapter;
  apiRootPrivate = environment.api_commons_adapter_private;

  // REST endpoints
  endpoints = {
    root: '/',
  };
  constructor(private http: HttpClient) {}

  getLandingServiceUrl(user: User) {
    for (const institution_info in environment.landing_service) {
      if (
        user.institution.name ===
        environment.landing_service[institution_info]['name']
      ) {
        return environment.landing_service[institution_info]['url'];
      }
    }
  }

  loadPrivateProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this.apiRootPrivate + 'project_list')
      .pipe(
        map((projects) => projects.filter((project) => project.pl_pi !== ''))
      );
  }
  loadPublicProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this.apiRoot + 'project_list')
      .pipe(
        map((projects) =>
          projects.filter(
            (project) => project.private === false && project.pl_pi === ''
          )
        )
      );
  }

  createProject(project: Project): Observable<Project> {
    return this.http
      .post<Project>(this.apiRootPrivate + 'project', project)
      .pipe(catchError(this.handleError));
  }

  updateProject(project: Project): Observable<Project> {
    return this.http
      .put<Project>(this.apiRootPrivate + 'project', project)
      .pipe(catchError(this.handleError));
  }

  deleteProject(project: Project): Observable<any> {
    return this.http
      .delete<any>(
        this.apiRootPrivate +
          `project/${project.id}/${project.institution.name}`
      )
      .pipe(catchError(this.handleError));
  }

  loadPrivateDatasets(project_id: String): Observable<Dataset[]> {
    return this.http
      .get<Dataset[]>(this.apiRootPrivate + `${project_id}/dataset_list`)
      .pipe(
        map((datasets) =>
          datasets
            .filter((dataset) => dataset.private === true)
            .sort((a, b) => Number(a.last_modified) - Number(b.last_modified))
        )
      );
  }

  loadPublicDatasets(project_id: String): Observable<Dataset[]> {
    return this.http
      .get<Dataset[]>(this.apiRoot + `${project_id}/dataset_list`)
      .pipe(
        map((datasets) =>
          datasets
            .filter((dataset) => dataset.private === false)
            .sort((a, b) => Number(a.last_modified) - Number(b.last_modified))
        )
      );
  }

  createDataset(dataset: Dataset): Observable<Dataset> {
    return this.http
      .post<Dataset>(this.apiRootPrivate + 'dataset', dataset)
      .pipe(catchError(this.handleError));
  }

  updateDataset(dataset: Dataset): Observable<Dataset> {
    return this.http
      .put<Dataset>(this.apiRootPrivate + 'dataset', dataset)
      .pipe(catchError(this.handleError));
  }

  deleteDataset(dataset: Dataset): Observable<any> {
    return this.http
      .delete<any>(
        this.apiRootPrivate +
          `dataset/${dataset.id}/${dataset.institution.name}`
      )
      .pipe(catchError(this.handleError));
  }

  restoreDocument(
    project: Project,
    document: ProjectDocument,
    user: User
  ): Observable<any> {
    return this.http
      .put<any>(
        this.getLandingServiceUrl(user) +
          `/commons/meta/projects/file/` +
          project.id +
          `/` +
          document.type +
        `/restore`, {},
        {
          headers: { REMOTE_USER: user.eppn, EMAIL: user.eppn},
        }
      )
      .pipe(catchError(this.handleError));
  }
  deleteDocument(document: ProjectDocument, user: User): Observable<any> {
    return this.http
      .delete<any>(document.url, {
        headers: { REMOTE_USER: user.eppn },
      })
      .pipe(catchError(this.handleError));
  }

  downloadFile(url, filename, user: User) {
    this.http
      .get(url, {
        headers: { REMOTE_USER: user.eppn },
        responseType: 'blob',
      })
      .subscribe((blob) => {
        fileSaver.saveAs(blob, filename);
      });
  }

  deleteUserProjectPermission(
    user: User,
    project: Project,
    userPermission: UserPermission
  ): Observable<any> {
    return this.http
      .delete<any>(
        this.getLandingServiceUrl(user) +
          `/commons/permissions/projects/users/` +
          project.id +
          `/` +
          userPermission.user_role +
          `/` +
          userPermission.user_email,
        {
          headers: { REMOTE_USER: user.eppn },
          responseType: 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  addUserProjectPermission(
    user: User,
    project: Project,
    userPermission: UserPermission
  ): Observable<any> {
    return this.http
      .post<any>(
        this.getLandingServiceUrl(user) +
          `/commons/permissions/projects/users/` +
          project.id,
        {
          user_role: Number(userPermission.user_role),
          user_email: userPermission.user_email,
        },
        {
          headers: { REMOTE_USER: user.eppn },
          responseType: 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  getProjectPermissions(
    user: User,
    project: Project
  ): Observable<UserPermission[]> {
    return this.http
      .get<UserPermission[]>(
        this.getLandingServiceUrl(user) +
          `/commons/permissions/projects/users/` +
          project.id,
        {
          headers: { REMOTE_USER: user.eppn },
          responseType: 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteUserDatasetPermission(
    user: User,
    dataset: Dataset,
    userPermission: UserPermission
  ): Observable<any> {
    return this.http
      .delete<any>(
        this.getLandingServiceUrl(user) +
          `/commons/permissions/datasets/users/` +
          dataset.id +
          `/` +
          userPermission.user_role +
          `/` +
          userPermission.user_email,
        {
          headers: { REMOTE_USER: user.eppn },
          responseType: 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  addUserDatasetPermission(
    user: User,
    dataset: Dataset,
    userPermission: UserPermission
  ): Observable<any> {
    return this.http
      .post<any>(
        this.getLandingServiceUrl(user) +
          `/commons/permissions/datasets/users/` +
          dataset.id,
        userPermission,
        {
          headers: { REMOTE_USER: user.eppn },
          responseType: 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  getDatasetPermissions(
    user: User,
    dataset: Dataset,
  ): Observable<UserPermission[]> {
    return this.http
      .get<UserPermission[]>(
        this.getLandingServiceUrl(user) +
          `/commons/permissions/datasets/users/` +
          dataset.id,
        {
          headers: { REMOTE_USER: user.eppn },
          responseType: 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  getDatasetPermissionsTeam(
    user: User,
    dataset: Dataset
  ): Observable<UserPermission[]> {
    return this.http
      .get<UserPermission[]>(
        this.getLandingServiceUrl(user) +
          `/commons/permissions/datasets/users/` +
          dataset.id,
        {
          headers: { REMOTE_USER: user.eppn },
          responseType: 'json',
        }
      )
      .pipe(
        map((permissions) =>
          permissions.filter(
            (permission) => permission.user_role.toString() !== '3'
          )
        )
      );
  }

  getDatasetPermissionsCustomer(
    user: User,
    dataset: Dataset
  ): Observable<UserPermission[]> {
    return this.http
      .get<UserPermission[]>(
        this.getLandingServiceUrl(user) +
          `/commons/permissions/datasets/users/` +
          dataset.id,
        {
          headers: { REMOTE_USER: user.eppn },
          responseType: 'json',
        }
      )
      .pipe(
        map((permissions) =>
          permissions.filter(
            (permission) => permission.user_role.toString() === '3'
          )
        )
      );
  }

  getDatasetFileVersions(
    user: User,
    dataset: Dataset
  ): Observable<DatasetFileVersion[]> {
    return this.http
      .get<DatasetFileVersion[]>(
        this.getLandingServiceUrl(user) +
          `/commons/data/datasets/file/` +
          dataset.id +
          `/versions`,
        {
          headers: { REMOTE_USER: user.eppn },
          responseType: 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Something bad happened; please try again lather.';

    console.error(error);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned a status code ${error.status}, ` +
          `Code was: ${JSON.stringify(error.error.code)}, ` +
          `Message was: ${JSON.stringify(error.error.message)}`
      );
      message = error.error.message;
    }
    // return an observable with a user-facing error message
    // FIXME: Log all error messages to Google Analytics
    return throwError(message);
  }

  // TODO: Get IRB Investigators for the given project from the backend.
  getDatasetIrbInvestigators(user: User, dataset: Dataset): Observable<IrbInvestigator[]> {
    return observableOf(mockIrbInvestigators);
  }
}
