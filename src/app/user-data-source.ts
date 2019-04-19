import {User} from './user';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ResourceApiService} from './shared/resource-api/resource-api.service';
import {CollectionViewer} from '@angular/cdk/collections';
import {Observable} from 'rxjs/internal/Observable';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';

export class UserDataSource implements DataSource<User> {

  private userSubject = new BehaviorSubject<User[]>([]);
  private countSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public count$ = this.countSubject.asObservable();

  constructor(private api: ResourceApiService) {}

  connect(collectionViewer: CollectionViewer): Observable<User[]> {
    return this.userSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.userSubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadUsers(filter = '', sort = 'display_name', sortOrder = 'asc', pageNumber = 0,
            pageSize = 10) {
    this.loadingSubject.next(true);
    this.api.findUsers(filter, sort, sortOrder, pageNumber, pageSize)
      .subscribe(results => {
        this.userSubject.next(results.items);
        this.countSubject.next(results.total);
        this.loadingSubject.next(false);
      },
        error1 => {
          this.userSubject.next(null);
          this.countSubject.next(0);
          this.loadingSubject.next(false);
      });
  }
}
