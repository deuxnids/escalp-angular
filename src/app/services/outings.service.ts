import {Injectable} from '@angular/core';
import {Outing} from '../models/outing.model';
import {Subject} from 'rxjs';
import * as firebase from 'firebase/app';
import {DataSnapshot} from 'firebase/database';
import {Data} from '@angular/router';


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
        console.log(keys);

        const outings = keys.map(function (key) {
          const d = values[key];
          d['uid'] = key;
          return d;
        });
        cb(outings);

      }
    );
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

}
