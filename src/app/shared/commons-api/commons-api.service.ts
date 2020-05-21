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
import { environment } from '../../../environments/environment';
import { FileAttachment } from '../../file-attachment';
import { User } from '../../user';
import { Project } from 'src/app/commons-types';
import { Dataset } from 'src/app/commons-types';
import { Document } from 'src/app/commons-types';
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
      .put<Project>(this.apiRoot + 'private/project', project)
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

  deleteDocument(document: Document): Observable<any> {
    return this.http
      .delete<any>(document.url)
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
