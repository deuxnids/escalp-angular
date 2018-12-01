import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class WeatherService {

  url = '/weather';

  constructor(private http: HttpClient) {
  }

  search(location) {
    return this.http.get('api/weather/etc/designs/meteoswiss/ajax/search/' + location + '.json').subscribe(data => {
      console.log(data);
    });
  }


  forecast(id) {
    //http://www.meteosuisse.admin.ch/product/output/forecast-chart/version__20180415_1902/fr/195000.json
    ///product/output/forecast-chart/version__20180416_1802/fr/

    return this.http.get(this.url + '/home.html', {responseType: 'text'}).pipe(
      mergeMap(data => {

        const regex = '/product\/output\/forecast-chart\/(version__[0-9]{6,8}_[0-9]{2,4})\/(fr)/';
        const re = new RegExp(regex);

        const version = re.exec(data)[0];
        return this.http.get(this.url + '/' + version + '/195000.json');

      })).subscribe(data => {
      console.log(data);
    });

  }

}
