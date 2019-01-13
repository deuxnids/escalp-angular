import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {DataSnapshot} from 'firebase/database';
import {rxSubscriber} from 'rxjs/internal/symbol/rxSubscriber';
import {Book} from '../models/book.model';
import {Outing} from '../models/outing.model';


@Injectable()
export class OutingsService {

  constructor() {
  }


  getRoutesBy(user, attribute, ascending = true) {

    const that = this;
    const promise = new Promise(function (resolve, reject) {

      let bla = firebase.database().ref('/outings').orderByChild(attribute).limitToFirst(50);
      if (ascending === false) {
        bla = firebase.database().ref('/outings').orderByChild(attribute).limitToLast(50);
      }

      bla.once('value', (data: DataSnapshot) => {
        const accesses = data.val();
        const promises = [];
        Object.keys(accesses).forEach(a => {
          promises.push(that.getRoute(a, user));
        });

        const results = Promise.all(promises);
        results.then(routes => {

          if (ascending) {

            resolve(routes.sort((a, b) => (a[attribute] > b[attribute]) ? 1 : -1));
          } else {
            resolve(routes.sort((a, b) => (a[attribute] > b[attribute]) ? -1 : 1));

          }
        });
      });


    });

    return promise;


  }

  getRoutesByAccessibility(user, attribute): any {
    const that = this;
    const promise = new Promise(function (resolve, reject) {

      firebase.database().ref('/accesses/' + user.origin).orderByChild(attribute).limitToFirst(50).once('value', (data: DataSnapshot) => {
        const accesses = data.val();
        const promises = [];
        Object.keys(accesses).forEach(a => {
          promises.push(that.getRoute(a, user));
        });

        const results = Promise.all(promises);
        results.then(routes => {

          resolve(routes.sort((a, b) => (a[attribute] > b[attribute]) ? 1 : -1));
        });
      });


    });

    return promise;

  }


  getRoute(id: string, user: any) {

    const attributes = ['pt_duration', 'car_duration', 'from_station', 'pt_arrival', 'pt_departure', 'pt_to'];


    // attributes.forEach((att) => {
    //  route[att] = accesses[a][att];
    // });

    return firebase.database().ref('/outings/' + id).once('value').then((x) => {
      let route = new Outing();
      route = x.val();
      route['uid'] = id;
      route['origin'] = user.origin;
      route['todo'] = false;
      if (user['todos'] !== undefined && user['todos'][id] !== undefined) {
        route['todo'] = user['todos'][id]['value'];
      }
      route['hide'] = false;
      if (user['hides'] !== undefined && user['hides'][id] !== undefined) {
        route['hide'] = user['hides'][id]['value'];
      }
      return route;
    }).then((route) => {
      return firebase.database().ref('/accesses/' + user.origin + '/' + route['uid']).once('value').then((a) => {
        const access = a.val();
        attributes.forEach((att) => {
          if (access === undefined || access === null) {
            route[att] = null;
          } else {
            route[att] = access[att];
          }
        });
        return route;

      });
    });
  }


  getAccess(from: string, route_id: string, cb) {
    firebase.database().ref('/accesses/' + from + '/' + route_id).on('value', (data: DataSnapshot) => {
      cb(data.val());
    });
  }


  getGeo(id: string, cb) {
    firebase.database().ref('/geo/' + id).on('value', (data: DataSnapshot) => {
      cb(data.val());
    });
  }


}
