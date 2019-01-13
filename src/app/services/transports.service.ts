import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class TransportsService {


  url = 'http://transport.opendata.ch/v1/';


  constructor(private http: HttpClient) {

  }

  search(value): Observable<any> {
    console.log(value);
    const url = this.url + 'locations?query=' + value;
    return this.http.get(url);
  }

  fetch(from, to, time): Observable<any> {
    const url = this.url + 'connections?from=' + from + '&to=' + to + '&isArrivalTime=1&time=' + time;
    return this.http.get(url);
  }
}
