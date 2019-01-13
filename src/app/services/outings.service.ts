import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {DataSnapshot} from 'firebase/database';


@Injectable()
export class OutingsService {

  constructor() {
  }


  getOutings(n: number, cb, first_key = null) {
    let query = firebase.database().ref('/outings').orderByKey().limitToFirst(n);
    if (first_key !== null) {
      query = query.startAt(first_key);
    }

    query.on('value', (data: DataSnapshot) => {
        const values = data.val();
        const keys = Object.keys(values);

        const outings = keys.map(function (key) {
          const d = values[key];
          d['uid'] = key;
          return d;
        });
        cb(outings);

      }
    );
  }

  getRoutes(cb, origin: string) {

    const attr = 'accessibility/' + origin + '/pt_duration';
    firebase.database().ref('/outings').orderByChild(attr).limitToFirst(50).on('value', (data: DataSnapshot) => {
      const routes = data.val();

      let outings = [];
      Object.keys(routes).forEach(r_uid => {
        const route = routes[r_uid];
        route.uid = r_uid;
        outings.push(route);
      });

      outings = outings.sort((a, b) => (a['accessibility'][origin]['pt_duration'] > b['accessibility'][origin]['pt_duration']) ? 1 : -1);

      cb(outings);
    });


  }

  getSingleBook(id: string, cb) {
    firebase.database().ref('/outings/' + id).on('value', (data: DataSnapshot) => {
      cb(data.val());
    });
  }


  getAccess(from: string, route_id: string, cb) {
    firebase.database().ref('/accesses/' + from + '/' + route_id).on('value', (data: DataSnapshot) => {
      cb(data.val());
    });
  }

  getConditions(id: string, cb) {

    firebase.database().ref('/conditions/' + id).on('value', (data: DataSnapshot) => {
      cb(data.val());
    });

  }

  getGeo(id: string, cb) {
    firebase.database().ref('/geo/' + id).on('value', (data: DataSnapshot) => {
      cb(data.val());
    });
  }

  getReco(id: string, cb) {
    firebase.database().ref('/recommandations/' + id + '/scores').orderByChild('score').limitToLast(50).on('value', (data: DataSnapshot) => {
      cb(data.val());
    });
  }

  getRecoUser(id: string, cb) {
    firebase.database().ref('/recommandations/' + id + '/user').on('value', (data: DataSnapshot) => {
      cb(data.val());
    });
  }

}
