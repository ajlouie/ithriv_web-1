import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of as observableOf } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { catchError, last, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FileAttachment } from '../../file-attachment';
import { User } from '../../user';
import * as ct from '../../commons-types';

@Injectable({
  providedIn: 'root'
})
export class CommonsApiService {
  constructor(private http: HttpClient) {}

  loadProjects(): Observable<ct.Project[]> {
    return this.http.get<ct.Project[]>(
      'http://localhost:5001/commons_adapter/api/project_list'
    );
  }
}
