import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import fileSaver from 'file-saver';
import { Observable, throwError } from 'rxjs';
import { catchError, map, } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Dataset,
  DatasetFileVersion,
  IrbInvestigator, IrbNumber,
  Project,
  ProjectDocument,
  UserPermission,
} from '../../commons-types';
import { Add } from '../../commons-types';
import { User } from '../../user';

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

  constructor(private http: HttpClient) {
  }

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
        catchError(this.handleError)
      );
  }

  loadPublicProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this.apiRoot + 'project_list_public')
      .pipe(
        map((projects) =>
          projects.filter(
            (project) => project.private === false && project.private === false
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

  deleteDatasetData(dataset: Dataset, user: User): Observable<any> {
    if (dataset.can_delete_data) {
      return this.http
        .delete<any>(
          this.getLandingServiceUrl(user) +
          `/commons/data/datasets/file/${dataset.id}`, {
            headers: {REMOTE_USER: user.eppn},
          })
        .pipe(catchError(this.handleError));
    }
  }

  restoreDatasetData(dataset: Dataset, user: User): Observable<any> {
    if (dataset.can_restore_data) {
      return this.http
        .put<any>(
          this.getLandingServiceUrl(user) +
          `/commons/data/datasets/file/${dataset.id}/restore`, {},
          {
            headers: {REMOTE_USER: user.eppn, EMAIL: user.eppn},
          }
        )
        .pipe(catchError(this.handleError));
    }
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
        `/` +
        document.filename +
        `/restore`, {},
        {
          headers: {REMOTE_USER: user.eppn, EMAIL: user.eppn},
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteDocument(document: ProjectDocument, user: User): Observable<any> {
    return this.http
      .delete<any>(document.url, {
        headers: {REMOTE_USER: user.eppn},
      })
      .pipe(catchError(this.handleError));
  }

  downloadFile(url, filename, user: User) {
    this.http
      .get(url, {
        headers: {REMOTE_USER: user.eppn},
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
          headers: {REMOTE_USER: user.eppn},
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
          headers: {REMOTE_USER: user.eppn},
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
          headers: {REMOTE_USER: user.eppn},
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
          headers: {REMOTE_USER: user.eppn},
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
          headers: {REMOTE_USER: user.eppn},
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
          headers: {REMOTE_USER: user.eppn},
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
          headers: {REMOTE_USER: user.eppn},
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
          headers: {REMOTE_USER: user.eppn},
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
          headers: {REMOTE_USER: user.eppn},
          responseType: 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  testSSO(): Observable<Add> {
    return this.http
      .get<Add>(`https://apidemo.uvarc.io/add/130/170`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Returns the list of IRB Investigators for the given project from the backend.
   * @param user
   * @param dataset
   */
  getDatasetIrbInvestigators(user: User, dataset: Dataset): Observable<IrbInvestigator[]> {
    return this.http
      .get<IrbInvestigator[]>(
        this.getLandingServiceUrl(user) +
        `/commons/meta/datasets/` +
        dataset.id +
        `/investigators`,
        {
          headers: {REMOTE_USER: user.eppn},
          responseType: 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Returns the list of IRB Study Numbers for the given user from the backend.
   * @param user
   */
  getUserIrbNumbers(user: User): Observable<IrbNumber[]> {
    return this.http
      .get<IrbNumber[]>(
        this.getLandingServiceUrl(user) +
        `/commons/meta/user/${user.email}/irb_protocols`,
        {
          headers: {REMOTE_USER: user.eppn},
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
}
