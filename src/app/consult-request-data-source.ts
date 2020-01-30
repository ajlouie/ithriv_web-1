import { ConsultRequest } from './consult-request';
import { User } from './user';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ResourceApiService } from './shared/resource-api/resource-api.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

export class ConsultRequestDataSource extends DataSource<ConsultRequest> {
  private consultRequestSubject = new BehaviorSubject<ConsultRequest[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();
  public count$ = this.countSubject.asObservable();
  public consultRequests = [];

  constructor(private api: ResourceApiService) {
    super();
  }
  connect(collectionViewer: CollectionViewer): Observable<ConsultRequest[]> {
    return this.consultRequestSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.consultRequestSubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadConsultRequestsByPage(pageNumber = 0, pageSize = 10) {
    const slicedRequests = this.consultRequests.slice(
      pageNumber * pageSize,
      pageNumber * pageSize + pageSize
    );
    this.consultRequestSubject.next(slicedRequests);
    this.countSubject.next(this.consultRequests.length);
  }

  loadConsultRequests(user: User, pageNumber = 0, pageSize = 10) {
    this.loadingSubject.next(true);
    this.api.findUserConsultRequests(user).subscribe(
      results => {
        this.consultRequests = results;
        this.loadConsultRequestsByPage(pageNumber, pageSize);
        this.loadingSubject.next(false);
      },
      error1 => {
        this.consultRequestSubject.next(null);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
      }
    );
  }
}
